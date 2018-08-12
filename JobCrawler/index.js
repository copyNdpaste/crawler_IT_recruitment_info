var Model=require('./model');
var Scraper=require('./scraper');
var Pages=[];

function generateUrls(limit){
    var jobkourl="http://www.jobkorea.co.kr/Starter/?JoinPossible_Stat=0&schPart=%2C%2C10016%2C%2C&schOrderBy=0&LinkGubun=0&LinkNo=0&schType=0&schGid=0&Page=";
    var saramurl="http://www.saramin.co.kr/zf_user/jobs/list/job-category?page=";
    //var incruiturl="http://job.incruit.com/jobdb_list/searchjob.asp?ct=1&ty=1&cd=150&crr=1&jobty=1,2,4&page=";
    var urls=[];
    var jobko=[];
    var saram=[];
    //var incruit=[];
    var i;
    
    for (i=1;i<=limit;i++){//사람인 직무:IT
        jobko.push(jobkourl+i); 
       
        //incruit.push(incruiturl+i);
        saram.push(saramurl+i+'&cat_key=40413%2C40421%2C40407%2C40430%2C40420%2C40721%2C40751%2C40745%2C41604%2C41611&exp_cd=1&search_optional_item=y&isAjaxRequest=0&page_count=50&sort=RL&type=job-category#searchTitle');
    }
    urls=jobko.concat(saram);
    //urls=urls.concat(incruit);
    return urls;
}
//store all urls in a global variable
Pages=generateUrls(9); //1~10p

function wizard(){
    //if the pages array is empty, done
    if(!Pages.length){
        console.log('done');
        return;
    }
    var url=Pages.shift();
    console.log(url);

    var scraper=new Scraper(url);//scraper 구조체의 객체 생성 후 url 넘김
    var model;
    console.log('Requests Left: '+Pages.length);//남은 페이지 수
    
    //despite error occur call function for crawling
    scraper.on('error',function(err){
        console.log(err);
        wizard();
    });
    //save datas
    scraper.on('complete',function(listing){
        console.log('model save');
        model=new Model(listing);
        model.save(function(err){
            if(err){
                console.log('DB err:'+url);
            }
        });
        wizard();
    });
}

var numberOfParallelRequests = 200;
for (var i = 0; i < numberOfParallelRequests; i++) {
  wizard();
}