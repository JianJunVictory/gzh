'use strict'
const ejs = require('ejs');
const heredoc = require('heredoc');
var tpl = heredoc(function() {
        /*
            <xml>
                <ToUserName><![CDATA[<%= toUserName %>]]></ToUserName>
                <FromUserName><![CDATA[<%= fromUserName %>]]></FromUserName>
                <CreateTime><%= createTime %></CreateTime>
                <MsgType><![CDATA[<%= msgType %>]]></MsgType>
                <% if (msgType=='text') { %>
                    <Content><![CDATA[<%= content %>]]></Content>
                <% } else if(msgType=='image') { %>
                    <Image>
                        <MediaId><![CDATA[<%= content.mediaId %>]]></MediaId>
                    </Image>
                <% } %>
            </xml>
        */
    })
    //串都可以两种形式的字符
var tpls = '<xml>' +
    '<ToUserName><![CDATA[<%= toUserName %>]]></ToUserName>' +
    '<FromUserName><![CDATA[<%= fromUserName %>]]></FromUserName>' +
    '<CreateTime><%= createTime %></CreateTime>' +
    '<MsgType><![CDATA[<%= msgType %>]]></MsgType>' +
    '<% if (msgType=="text") { %>' +
    '<Content><![CDATA[<%= content %>]]></Content>' +
    '<% } else if(msgType=="image") { %>' +
    '<Image>' +
    '<MediaId><![CDATA[<%= content.mediaId %>]]></MediaId>' +
    '</Image>' +
    '<% } %>' +
    '</xml>'
var compiled = ejs.compile(tpls);
module.exports = {
    compiled: compiled
}