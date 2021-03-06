/**
 * @author synder on 2017/2/17
 * @copyright
 * @desc
 */


const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

//用户===================================================
const AnswerCommentSchema = new Schema({
    status          : {type: Number, required: true},    //回答状态
    content         : {type: String,  required: true},   //评论内容
    comment_count   : {type: Number, required: true},    //评论数量
    favour_count    : {type: Number, required: true},    //点赞数量
    collect_count   : {type: Number, required: true},    //收藏数量
    create_time     : {type: Date, required: true},      //创建时间
    update_time     : {type: Date, required: true},      //更新时间
    question_id     : {type: ObjectId, required: true, ref: 'Question'},        //问题ID
    answer_id       : {type: ObjectId, required: true, ref: 'QuestionAnswer'},  //回答ID
    create_user_id  : {type: ObjectId, required: true, ref: 'User'},            //评论用户
    to_user_id      : {type: ObjectId, required: false, ref: 'User'},           //对那个用户评论
    to_comment_id   : {type: ObjectId, required: false, ref: 'AnswerComment'}   //对那个评论评论
});

AnswerCommentSchema.virtual('id', function () {
    return this._id.toString();
});

AnswerCommentSchema.index({create_time : 1});

AnswerCommentSchema.pre('validate', function (next) {
    if(!this.create_time){
        this.create_time = new Date();
    }

    if(!this.update_time){
        this.update_time = new Date();
    }

    next();
});

//回答状态
AnswerCommentSchema.statics.STATUS = {
    LOCK : -1,
    REMOVED: 0,
    NORMAL : 1
};

exports.AnswerCommentSchema = AnswerCommentSchema;