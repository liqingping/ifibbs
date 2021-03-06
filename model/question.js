/**
 * @author synder on 2017/2/18
 * @copyright
 * @desc
 */

const async = require('async');
const mongodb = require('../service/mongodb').db;
const elasticsearch = require('../service/elasticsearch').client;

const Question = mongodb.model('Question');


/**
 * @desc 新建问题
 * */
exports.createNewQuestion = function (userID, question, callback) {

    let now = new Date();

    let questionDoc = {
        status: Question.STATUS.NORMAL,
        tags: question.tags,
        title: question.title,
        describe: question.describe,
        answer_count: 0,
        favour_count: 0,
        attention_count: 0,
        collect_count: 0,
        create_user_id: userID,
        create_time: now,
        update_time: now,
    };

    Question.create(questionDoc, function (err, result) {
        if (err) {
            return callback(err);
        }

        //在搜索引擎中创建索引
        let questionID = result._id;

        let elasticDoc = {
            title: questionDoc.title,
            describe: questionDoc.describe,
            tags: questionDoc.tags,
            create_time: questionDoc.create_time,
            update_time: questionDoc.update_time,
        };

        elasticsearch.create({
            index: elasticsearch.indices.question,
            type: elasticsearch.indices.question,
            id: questionID.toString(),
            body: elasticDoc
        }, function (err, response) {
            if (err) {
                return callback(err);
            }

            callback(null, questionID);
        });
    });
};

/**
 * @desc 删除用户提问
 * */
exports.removeUserQuestion = function (userID, questionID, callback) {

    let condition = {
        _id: questionID,
        create_user_id: userID,
    };

    let update = {
        status: Question.STATUS.REMOVED
    };

    Question.update(condition, update, function (err, result) {
        if (err) {
            return callback(err);
        }

        if (result.n !== 1) {
            return callback(null, false);
        }

        elasticsearch.delete({
            index: elasticsearch.indices.question,
            type: elasticsearch.indices.question,
            id: questionID.toString()
        }, function (err, response) {
            callback(err, true);
        });
    });
};

/**
 * @desc 获取用户的问题列表
 * */
exports.getQuestionList = function (userID, pageSkip, pageSize, callback) {

    let condition = {
        create_user_id: userID
    };

    async.parallel({
        count: function (cb) {
            Question.count(condition, cb);
        },

        questions: function (cb) {
            Question
                .find(condition)
                .sort('create_time')
                .skip(pageSkip)
                .limit(pageSize).exec(cb);
        }
    }, callback);
};

/**
 * @desc 获取推荐问题列表
 * */
exports.getRecommenedQuestionList = function (pageSkip, pageSize, callback) {

    let condition = {};

    async.parallel({
        count: function (cb) {
            Question.count(condition, cb);
        },

        questions: function (cb) {
            Question
                .find(condition)
                .sort('answer_count favour_count attention_count create_time')
                .skip(pageSkip)
                .limit(pageSize)
                .exec(cb);
        }
    }, callback);
};


/**
 * @desc 获取问题详情
 * */
exports.getQuestionDetail = function (questionID, callback) {

    let condition = {
        _id: questionID,
    };

    Question.findOne(condition, callback);
};


/**
 * @desc 根据问题、问题描述搜索问题
 * */
exports.searchQuestionByAttribute = function (content, pageSkip, pageSize, callback) {

    elasticsearch.search({
        index: elasticsearch.indices.question,
        body: {
            query: {
                multi_match: {
                    query: content,
                    fields: ['title', 'describe']
                }
            },
            highlight: {
                fields: {
                    title: {},
                    describe: {}
                }
            }
        }
    }, function (err, response) {

        if (err) {
            return callback(err);
        }
        
        let total = response.hits.total;
        let hits = response.hits.hits;

        let questions = hits.map(function (hit) {
            
            let title = hit.highlight.title ? hit.highlight.title.join() : hit._source.title;
            let describe = hit.highlight.describe ? hit.highlight.describe.join() : hit._source.describe;
            
            return {
                _id : hit._id,
                tags: hit.tags,
                create_time: hit.create_time,
                update_time: hit.update_time,
                title: title,
                describe: describe,
            };
        });
        

        callback(null, {
            count: total,
            questions: questions
        });
    });
};

/**
 * @desc 根据问题回答搜索问题
 * */
exports.searchQuestionByAnswer = function (content, pageSkip, pageSize, callback) {
    elasticsearch.search({
        index: elasticsearch.indices.question,
        body: {
            query: {
                match: {
                    content: content
                }
            },
            highlight: {
                fields: {
                    title: {},
                    describe: {}
                }
            }
        }
    }, function (err, response) {
        if (err) {
            return callback(err);
        }

        let total = response.hits.total;
        let hits = response.hits.hits;
        
        let ids = [];

        hits.forEach(function (hit) {
            ids.push(hit._source.question_id);
        });
        
        Question.find({_id: {$in: ids}}, function (err, questions) {
            if(err){
                return callback(err);
            }
            
            callback(null, {
                count: total,
                questions: questions
            });
        });
    });

};
