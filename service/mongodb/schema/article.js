/**
 * @author synder on 2017/2/17
 * @copyright
 * @desc
 */

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

//用户===================================================
const ArticleSchema = new Schema({
    status          : {type: Number,  required: true},    //文章状态
    top             : {type: Boolean, required: true},    //是否置顶
    title           : {type: String,  required: true},    //文章标题
    summary         : {type: String,  required: true},    //文章摘要
    icon            : {type: String,  required: true},    //文章图标
    cover           : {type: String,  required: true},    //封面图片
    tags            : {type: Array,   required: true},    //文章标签
    content         : {type: String,  required: true},    //文章内容
    browse_count    : {type: Number,  required: true},    //浏览次数
    favour_count    : {type: Number,  required: true},    //被赞次数
    comment_count   : {type: Number,  required: true},    //被评论次数
    collect_count   : {type: Number,  required: true},    //被收藏次数
    create_time     : {type: Date,    required: true},    //创建时间
    update_time     : {type: Date,    required: true},    //更新时间
    subject_id      : {type: ObjectId, required: false, ref: 'Subject'},  //文章所属主题
    create_user_id  : {type: ObjectId, required: false, ref: 'User'}      //创建人
});

ArticleSchema.pre('validate', function (next) {
    if(!this.create_time){
        this.create_time = new Date();
    }

    if(!this.update_time){
        this.update_time = new Date();
    }

    next();
});

ArticleSchema.virtual('id', function () {
    return this._id.toString();
});

ArticleSchema.index({create_time : 1});
ArticleSchema.index({status : 1});

//文章状态
ArticleSchema.statics.STATUS = {
    UNPUBLISHED : -2,   //未发布
    UNREADABLE : -1,    //不可读
    PUBLISHED : 1,      //已发布
    DELETED: 0,         //已删除
};

exports.ArticleSchema = ArticleSchema;

