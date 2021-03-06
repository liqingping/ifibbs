/**
 * @author synder on 2017/2/20
 * @copyright
 * @desc
 */

const async = require('async');
const mongodb = require('../service/mongodb').db;

const UserNotification = mongodb.model('UserNotification');


/*
 * 获取用户系统通知
 * */
exports.getSysNotificationList = function (userId, pageSkip, pageSize, callback) {
    let condition = {
        user_id: userId,
        category: UserNotification.CATEGORY.SYSTEM
    };

    async.parallel({
        count: function (cb) {
            UserNotification.count(condition, cb)
        },
        notifications: function (cb) {
            UserNotification.find(condition)
                .sort('create_time')
                .skip(pageSkip)
                .limit(pageSize)
                .exec(cb);
        }
    }, callback)
};

/*
 * 获取用户业务通知
 * */

exports.getBusinessNotificationList = function (userId, pageSkip, pageSize, callback) {
    let condition = {
        user_id: userId,
        category: UserNotification.CATEGORY.BUSINESS
    };

    async.parallel({
        count: function (cb) {
            UserNotification.count(condition, cb)
        },
        notifications: function (cb) {
            UserNotification.find(condition)
                .sort("create_time")
                .skip(pageSkip)
                .limit(pageSize)
                .exec(cb)
        }
    }, callback)
};

/*
 * 修改通知阅读状态
 * */
exports.changeNotificationToReaded = function (userId, notificationIds, callback) {
    async.forEachSeries( notificationIds, function (id, cb) {
        let condition = {
            _id: id,
            user_id: userId,
        };
        let update = {
            status: UserNotification.STATUS.READED
        };

        UserNotification.update(condition, update, {upsert: true}, cb)

    }, function (err) {
        callback(err, true);
    });
};

