/**
 * @author synder on 2017/2/17
 * @copyright
 * @desc
 */


const commentModel = require('../../model/comment');

/**
 * @desc 回答评论列表
 * */
exports.getAnswerCommentList = function (req, res, next) {
    let pageSize = req.query.page_size;
    let pageSkip = req.query.page_skip;
    let questionID = req.query.question_id;
    let answerID = req.query.answer_id;

    commentModel.getAnswerCommentList(answerID, pageSkip, pageSize, function (err, results) {
        if(err){
            return next(err);
        }
        
        let count = results.count;
        let comments = [];

        results.comments.forEach(function (comment) {
            
            if(comment.question_id && comment.answer_id && comment.create_user_id && comment.to_user_id){
                comments.push({
                    question_id: comment.question_id._id,
                    answer_id: comment.answer_id._id,
                    user_id: comment.create_user_id._id,
                    user_avatar: comment.create_user_id.user_avatar,
                    user_name: comment.create_user_id.user_name,
                    to_user_id: comment.to_user_id.user_name,
                    to_user_name: comment.to_user_id.user_name,
                    comment_id: comment._id,
                    content: comment.comment_count,
                    comment_favour_count: comment.favour_count,
                    comment_publish_time: comment.create_time
                });
            }
        });
        
        res.json({
            flag: '0000',
            msg: '',
            result: {
                count: count,
                list: comments
            }
        });
    });
};