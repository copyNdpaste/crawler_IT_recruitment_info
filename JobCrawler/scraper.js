var http=require('http');
var cheerio=require('cheerio');
var util=require('util');
var EventEmitter=require('events').EventEmitter;
var STATUS_CODES=http.STATUS_CODES;

var Iconv = require('iconv').Iconv;
var request = require('request');
var iconv = new Iconv('EUC-KR', 'utf-8//translit//ignore');

//Scraper Constructor
function Scraper(url){
    this.url=url;
    this.init();
}

util.inherits(Scraper,EventEmitter);

//Initialize Scraping
Scraper.prototype.init=function(){
    var model;
    var self=this;
    self.on('loaded',function(html){
        self.parsePage(html);//페이지 해석
    });
    self.loadWebPage();
};

Scraper.prototype.loadWebPage=function(){
    var self=this;
    
    //console.log('\n\nLoading '+website);
    http.get(self.url, function(res){
        var body='';
        if(res.statusCode!==200){
            return self.emit('error',STATUS_CODES[res.statusCode]);
        }
        res.on('data',function(chunk){
            body+=chunk;
        });
        res.on('end',function(){
            self.emit('loaded',body);
        });
    })
    .on('error',function(err){
        self.emit('error',err);
    });
};

//Parse html and return an object
Scraper.prototype.parsePage=function(html){
    var $=cheerio.load(html);
    var self=this;

    if($('body').attr('class')=='modalOpenBd best1000'){//jobkorea
        $('.filterList li').each(function(i,li){
            var companyname=$(li).find('.co .coTit a').text();
            var title=$(li).find('.info .tit a').attr('title');
            var link='http://www.jobkorea.co.kr'+$(li).find('.info .tit a').attr('href');
            console.log(link);
            var len=$(li).find('.info .sTit span').length;
            var field=[];
            for(var i=0;i<len;i++){
                field[i]=$(li).find('.info .sTit span').eq(i).text();
            }
            var career=$(li).find('.sDesc strong').text();
            var levOfEdu=$(li).find('.sDesc span').eq(0).text();
            var area=$(li).find('.sDesc span').eq(1).text();
            var deadline=$(li).find('.side .day').text();
            var model={
                companyname:companyname,
                title:title,
                link:link,
                field:field,
                career:career,
                levOfEdu:levOfEdu,
                area:area,
                deadline:deadline,
                from:'jobkorea'
            };
            self.emit('complete',model);
        }); 
    }else if($('body').attr('class')=='has_lnb'){//saramin
        $('.recruiting_list tbody tr').each(function(i,tr){
            var companyname=$(tr).find('.company_nm .str_tit span').text();
            var title=$(tr).find('.notification_info .job_tit .str_tit span').text();
            var link='http://www.saramin.co.kr'+$(tr).find('.notification_info .job_tit a').attr('href');
            console.log(link);
            var len=$(tr).find('.notification_info .job_sector span').length;
            var field=[];
            for(var i=0;i<len;i++){
                field[i]=$(tr).find('.notification_info .job_sector span').eq(i).text();
            }
            var career=$(tr).find('.recruit_condition .career').text();
            var levOfEdu=$(tr).find('.recruit_condition .education').text();
            var area=$(tr).find('.company_info .work_place').text();
            var deadline=$(tr).find('.support_info .deadlines').text();
            
            var model={
                companyname:companyname,
                title:title,
                link:link,
                field:field,
                career:career,
                levOfEdu:levOfEdu,
                area:area,
                deadline:deadline,
                from:'saramin'
            };
            self.emit('complete',model);
        });
    }
    /*else{//incruit
        console.log('incruit');
        $('.list_full_default table tbody tr').each(function(i,tr){
            var companyname=$(tr).find('th .companys .check_list_r .links a').attr('title');
            //console.log(companyname);
            
            
            var model={
                companyname:companyname,
                from:'incruit'
            }
            self.emit('complete',model);
            /*var title=$(tr).find('.notification_info .job_tit .str_tit span').text();
            var len=$(tr).find('.notification_info .job_sector span').length;
            var field=[];
            for(var i=0;i<len;i++){
                field[i]=$(tr).find('.notification_info .job_sector span').eq(i).text();
            }
            var career=$(tr).find('.recruit_condition .career').text();
            var levOfEdu=$(tr).find('.recruit_condition .education').text();
            var area=$(tr).find('.company_info .work_place').text();
            var deadline=$(tr).find('.support_info .deadlines').text();
            
            var model={
                companyname:companyname,
                title:title,
                field:field,
                career:career,
                levOfEdu:levOfEdu,
                area:area,
                deadline:deadline,
                from:'incruit'
            };
            self.emit('complete',model);
        });
    }*/
    
};
module.exports=Scraper;