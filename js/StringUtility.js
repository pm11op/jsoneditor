/*
================================================================================
    Name        :   StringUtility
    In          :   [none]      
    Out         :   [none]      
    Note        :   文字列用ユーティリティ群
--------------------------------------------------------------------------------
    Version     :   Ver1.0.0    |   2006/01/16  |   新規作成
                :   Ver1.0.1    |   2006/12/19  |   シングルクォーテーションに対する処理を追加
                :   Ver1.0.2    |   2007/02/15  |   スペルミス修正[getLengthByBite]->[getLengthByByte]
                :   Ver1.1.0    |   2007/02/17  |   [StringUtility.Encode.JavaScriptComplete]を追加
--------------------------------------------------------------------------------
    License     :   MIT license
    URL         :   www.kanasansoft.com
================================================================================
*/

/*--------------------------------------------------------------------------------
    コンストラクタ
--------------------------------------------------------------------------------*/
function StringUtility(){
}

StringUtility.Encode
=   function(){
}

StringUtility.Decode
=   function(){
}

StringUtility.Convert
=   function(){
}

/*--------------------------------------------------------------------------------
    HTMLエンコードを行なう
--------------------------------------------------------------------------------*/
StringUtility.Encode.HTML
=   function(str){
    return          str                                         .
                    replace(    /&/ig   ,   "&amp;"     )       .
                    replace(    /</ig   ,   "&lt;"      )       .
                    replace(    />/ig   ,   "&gt;"      )       .
                    replace(    /'/ig   ,   "&apos;"    )       .
                    replace(    /"/ig   ,   "&quot;"    )       .
                    replace(    / /ig   ,   "&nbsp;"    )       ;
}

/*--------------------------------------------------------------------------------
    HTMLデコードを行なう
--------------------------------------------------------------------------------*/
StringUtility.Decode.HTML
=   function(str){
    return          str                                         .
                    replace(    /&nbsp;/ig  ,   " "     )       .
                    replace(    /&quot;/ig  ,   "\""    )       .
                    replace(    /&apos;/ig  ,   "'"     )       .
                    replace(    /&gt;/ig    ,   ">"     )       .
                    replace(    /&lt;/ig    ,   "<"     )       .
                    replace(    /&amp;/ig   ,   "&"     )       ;
}

/*--------------------------------------------------------------------------------
    HTMLエンコードを行なう(Bookmarklet用)
--------------------------------------------------------------------------------*/
StringUtility.Encode.HTMLforBookmarklet
=   function(str){
    return          str                                         .
                    replace(    /&/ig   ,   "&amp;"     )       .
                    replace(    /</ig   ,   "&lt;"      )       .
                    replace(    />/ig   ,   "&gt;"      )       .
                    replace(    /'/ig   ,   "&apos;"    )       .
                    replace(    /"/ig   ,   "&quot;"    )       ;
}

/*--------------------------------------------------------------------------------
    JavaScriptエンコードを行なう
--------------------------------------------------------------------------------*/
StringUtility.Encode.JavaScript
=   function(str){
    return          str                                         .
                    replace(    /\\/ig  ,   "\\\\"      )       .
/*                  replace(    /\b/ig  ,   "\\b"       )       .*/
                    replace(    /\f/ig  ,   "\\f"       )       .
                    replace(    /\n/ig  ,   "\\n"       )       .
                    replace(    /\r/ig  ,   "\\r"       )       .
                    replace(    /\t/ig  ,   "\\t"       )       .
                    replace(    /'/ig   ,   "\\'"       )       .
                    replace(    /"/ig   ,   "\\\""      )       ;
}

/*--------------------------------------------------------------------------------
    JavaScriptエンコードを行なう
--------------------------------------------------------------------------------*/
StringUtility.Encode.JavaScriptComplete
=   function(str){
    var rtn =   "";
    for(var i=0;i<str.length;i++){
        rtn +=  "\\u"+(("0000"+(str.charCodeAt(i).toString(16))).slice(-4));
    }
    return rtn;
}

/*--------------------------------------------------------------------------------
    tabをspaceに変換する
--------------------------------------------------------------------------------*/
StringUtility.Convert.TabToSpace
=   function(str,tabNumber){

    var linesRN                         =   str.split("\r\n");
    for(var lineCntRN=0;lineCntRN<linesRN.length;lineCntRN++){
        var linesN                      =   linesRN[lineCntRN].split("\n");
        for(var lineCntN=0;lineCntN<linesN.length;lineCntN++){
            var linesR                  =   linesN[lineCntN].split("\r");
            for(var lineCntR=0;lineCntR<linesR.length;lineCntR++){
                var wordsT              =   linesR[lineCntR].split("\t");
                for(var wordsCntT=0;wordsCntT<wordsT.length-1;wordsCntT++){
                    wordsT[wordsCntT]   +=  StringUtility.getRepeatString(
                                                " "                                                                     ,
                                                tabNumber-(StringUtility.getLengthByByte(wordsT[wordsCntT])%tabNumber)  )
                }
                linesR[lineCntR]        =   wordsT.join("");
            }
            linesN[lineCntN]            =   linesR.join("\r");
        }
        linesRN[lineCntRN]              =   linesN.join("\n");
    }
    var rtn                             =   linesRN.join("\r\n");

    return rtn;

}

/*--------------------------------------------------------------------------------
    改行コードを"<br />"に変換する
--------------------------------------------------------------------------------*/
StringUtility.Convert.NewLineCodeToTag
=   function(str){
    return          str                                             .
                    replace(    /\r\n/ig    ,   "<br />"    )       .
                    replace(    /\r/ig      ,   "<br />"    )       .
                    replace(    /\n/ig      ,   "<br />"    )       ;
}

/*--------------------------------------------------------------------------------
    文字バイト長取得
--------------------------------------------------------------------------------*/
StringUtility.getLengthByByte
=   function(str){
    var count   =   0;
    for(var i=0;i<str.length;i++){
        var code    =   str.charCodeAt(i);
        while(code!=0){
            count++;
            code>>>=8;
        }
    }
    return count;
}

/*--------------------------------------------------------------------------------
    繰り返し文字取得
--------------------------------------------------------------------------------*/
StringUtility.getRepeatString
=   function(str,num){
    var rtn =   "";
    for(var i=0;i<num;i++){
        rtn +=  str;
    }
    return rtn;
}
