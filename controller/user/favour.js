/**
 * @author synder on 2017/2/17
 * @copyright
 * @desc
 */

const favourModel = require('../../model/favour');

/**
 * @desc 用户对回答点赞
 * */
exports.addAnswerToFavour = function(req, res, next){
    let questionID = req.body.question_id;
    let answerID = req.body.answer_id;
    
    let userID = req.session.id;

    favourModel.createFavourToAnswer(userID, answerID, function (err, success) {
       if(err){
           return next(err);
       } 
       
       res.json({
           flag: '0000',
           msg :'',
           result: {
               ok: true
           }
       });
    });
};

/**
 * @desc 用户取消对回答点赞
 * */
exports.removeAnswerFromFavour = function(req, res, next){
    let questionID = req.body.question_id;
    let answerID = req.body.answer_id;
    
    let userID = req.session.id;

    favourModel.cancelFavourToAnswer(userID, answerID, function (err, success) {
        if(err){
            return next(err);
        }

        res.json({
            flag: '0000',
            msg :'',
            result: {
                ok: success
            }
        });
    });
    
};

/**
 * @desc 用户对文章点赞
 * */
exports.addArticleToFavour = function(req, res, next){
    let articleID = req.query.article_id;

    let userID = req.session.id;

    favourModel.createFavourToArticle(userID, articleID, function (err, success) {
        if(err){
            return next(err);
        }

        res.json({
            flag: '0000',
            msg :'',
            result: {
                ok: success
            }
        });
    });
};

/**
 * @desc 用户取消对文章点赞
 * */
exports.removeArticleFromFavour = function(req, res, next){
    let articleID = req.query.article_id;

    let userID = req.session.id;

    favourModel.cancelFavourToArticle(userID, articleID, function (err, success) {
        if(err){
            return next(err);
        }

        res.json({
            flag: '0000',
            msg :'',
            result: {
                ok: success
            }
        });
    });
};


/**
 * @desc 用户对文章点赞
 * */
exports.addAnswerCommentToFavour = function(req, res, next){
    let commentID = req.query.comment_id;

    let userID = req.session.id;

    favourModel.createFavourToAnswerComment(userID, commentID, function (err, success) {
        if(err){
            return next(err);
        }

        res.json({
            flag: '0000',
            msg :'',
            result: {
                ok: success
            }
        });
    });
};

/**
 * @desc 用户取消对文章点赞
 * */
exports.removeAnswerCommentFromFavour = function(req, res, next){
    let commentID = req.query.comment_id;

    let userID = req.session.id;

    favourModel.cancelFavourToAnswerComment(userID, commentID, function (err, success) {
        if(err){
            return next(err);
        }

        res.json({
            flag: '0000',
            msg :'',
            result: {
                ok: success
            }
        });
    });
};