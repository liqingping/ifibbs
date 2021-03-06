/**
 * @author synder on 2017/2/17
 * @copyright
 * @desc 用户关注
 */

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const STATUS = {
    ATTENTION : true,        //关注
    NO_ATTENTION : false     //不关注
};

//用户关注问题和专题=========================================
const AttentionQuestionSchema = new Schema({
    status    : {type: Boolean, required: true},                      //关注状态
    user_id   : {type: ObjectId, required: true, ref: 'User'},        //关注用户ID
    question_id : {type: ObjectId, required: true, ref: 'Question'},  //关注对象ID
    question_user_id : {type: ObjectId, required: true, ref: 'User'}, //关注对象ID
    create_time : {type: Date, required: true},     //创建时间
    update_time : {type: Date, required: true},     //更新时间
});

AttentionQuestionSchema.pre('validate', function (next) {
    if(!this.create_time){
        this.create_time = new Date();
    }

    if(!this.update_time){
        this.update_time = new Date();
    }

    next();
});

AttentionQuestionSchema.virtual('id', function () {
    return this._id.toString();
});

AttentionQuestionSchema.index({user_id : 1, question_id: 1});

//关注状态
AttentionQuestionSchema.statics.STATUS = STATUS;





//用户关注专题==============================================
const AttentionSubjectSchema = new Schema({
    status    : {type: Boolean, required: true},                    //关注状态
    user_id   : {type: ObjectId, required: true, ref: 'User'},      //关注用户ID
    subject_id : {type: ObjectId, required: true, ref: 'Subject'},  //关注对象ID
    create_time : {type: Date, required: true},     //创建时间
    update_time : {type: Date, required: true},     //更新时间
});

AttentionSubjectSchema.virtual('id', function () {
    return this._id.toString();
});

AttentionSubjectSchema.index({user_id : 1, subject_id: 1});

//关注状态
AttentionSubjectSchema.statics.STATUS = STATUS;






//用户关注用户==============================================
const AttentionUserSchema = new Schema({
    status    : {type: Boolean, required: true},          //关注状态
    create_time : {type: Date, required: true},           //创建时间
    update_time : {type: Date, required: true},           //更新时间
    user_id   : {type: ObjectId, required: true, ref: 'User'},         //关注用户ID
    to_user_id : {type: ObjectId, required: true, ref: 'User'},        //关注用户ID
});

AttentionUserSchema.virtual('id', function () {
    return this._id.toString();
});

AttentionUserSchema.index({user_id : 1, to_user_id: 1});

//关注状态
AttentionUserSchema.statics.STATUS = STATUS;




exports.AttentionQuestionSchema = AttentionQuestionSchema;
exports.AttentionSubjectSchema = AttentionSubjectSchema;
exports.AttentionUserSchema = AttentionUserSchema;