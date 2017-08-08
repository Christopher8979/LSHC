function initTweens(e){createjs.Tween.get(road,{loop:!0}).to({x:-w},45*speed),createjs.Tween.get(clouds,{loop:!0}).to({x:w},5e3*speed),createjs.Tween.get(backBg,{loop:!0}).to({x:-w},500*speed),createjs.Tween.get(frontBg,{loop:!0}).to({x:-w},80*speed)}function tickHandler(e){paused||(sound.volume=0==sound.volume?playVol:0,$(document).trigger("play-pause"),paused=!0);var t=e.delta/5;if(!e.paused){treeStrip.forEach(function(e,n){treeBounds=e.getBounds(),e.x=e.x+treeBounds.width<=0?e.x=w+treeBounds.width+Math.random()*w:e.x-t}),buildings.forEach(function(e,n){buildingBounds=e.getBounds(),e.x=e.x+buildingBounds.width<=0?w+buildingBounds.width+Math.random()*w:e.x-t}),ditch.x+200<0?(ditch.x=w+(.5+Math.random())*w,hitFlags.ditch=!1):ditch.x=ditch.x-t;var n=ditch.localToLocal(0,0,ambulance);if(hitDitch(ambulance.hitTest(n.x,n.y)),Math.random()>.95){var o=Math.random()<.6;dropTokens(o)}if(ptokens.forEach(function(e){var t=e.localToLocal(20,0,ambulance);ambulance.hitTest(t.x,t.y)&&tokenCollected(e,!0)},this),ntokens.forEach(function(e){var t=e.localToLocal(20,0,ambulance);ambulance.hitTest(t.x,t.y)&&tokenCollected(e,!1)},this),"right"==ambulance.move){var a=ambulance.getBounds();ambulance.x=ambulance.x+a.width<w?ambulance.x+7:ambulance.x}else"left"==ambulance.move&&(ambulance.x=ambulance.x>0?ambulance.x-7:ambulance.x);updateTime(e.runTime),createjs.Ticker.getTime(!0)/6e4>=2&&($(document).trigger("play-pause"),$(document).trigger("game-over",["time-out"])),stage.update(e)}}function updateTime(e){time.text=new Date(e).toISOString().substr(11,8)}function moveSprite(e){if(-1!==location.pathname.search("/play-game")){var t=e.type;39!==e.keyCode&&37!==e.keyCode&&32!==e.keyCode||(39===e.keyCode&&(ambulance.move="keydown"==t?"right":null),37===e.keyCode&&(ambulance.move="keydown"==t?"left":null),32===e.keyCode&&($("#questions-modal").hasClass("open")||"keydown"!=t||$(document).trigger("play-pause")))}}var stage,w,h,loader,sky,sun,clouds,road,buildings,backBg,frontBg,ambulance,speed=100,time,hitFlags={},playVol=.5,effectVolRatio=.25,createTreeStrip,addTrees,treeStrip,ditch,buildings,ptokens,ntokens,sound,flag=!0,score={value:0,ob:{}},star={value:0,ob:{}},paused=!1,tokensCaught=0,IMAGES_HOLDER=[{src:"Sky.png",id:"sky"},{src:"Sun.png",id:"sun"},{src:"Buildings-Back.png",id:"backBg"},{src:"Buildings-Front.png",id:"frontBg"},{src:"Road.png",id:"road"},{src:"Clouds.png",id:"clouds"},{src:"tree-sprite.png",id:"tree"},{src:"building-sprite.png",id:"building"},{src:"ambulance-sprite.png",id:"amb"},{src:"star-sprite.png",id:"star"},{src:"ditch.png",id:"ditch"},{src:"positive-sprite.png",id:"ptoken"},{src:"negative-sprites.png",id:"ntoken"}];$(document).on("initialize-game",function(){stage=new createjs.Stage("game-holder"),w=stage.canvas.width,h=stage.canvas.height,(loader=new createjs.LoadQueue(!1)).addEventListener("complete",function(e){$(".preloader").removeClass("loading"),$(".preloader .preloader-wrapper").removeClass("active"),(sky=new createjs.Shape).graphics.beginBitmapFill(loader.getResult("sky")).drawRect(0,0,w,h);var t=loader.getResult("sun");(sun=new createjs.Shape).graphics.beginBitmapFill(t).drawRect(t.width,0,t.width,t.height),sun.y=.2*t.height,sun.x=Math.random()*(w-2*t.width);var n=loader.getResult("clouds");(clouds=new createjs.Shape).graphics.beginBitmapFill(n).drawRect(0,0,5*n.width,n.height),clouds.x=-4*n.width,clouds.cache(0,0,5*n.width,n.height);var o=loader.getResult("road");(road=new createjs.Shape).graphics.beginBitmapFill(o).drawRect(0,0,2*o.width,o.height),road.tileW=0,road.y=h-o.height,road.cache(0,0,2*o.width,o.height);var a=loader.getResult("backBg");(backBg=new createjs.Shape).graphics.beginBitmapFill(a).drawRect(0,0,2*a.width,a.height),backBg.y=h-(a.height+o.height),backBg.cache(0,0,2*a.width,a.height);var i=loader.getResult("frontBg");(frontBg=new createjs.Shape).graphics.beginBitmapFill(i).drawRect(0,0,2*i.width,i.height),frontBg.y=h-(i.height+o.height),frontBg.cache(0,0,2*i.width,i.height);var s=loader.getResult("ditch");(ditch=new createjs.Shape).graphics.beginBitmapFill(s).drawRect(0,0,s.width,s.height),ditch.x=(.5+Math.random())*w,ditch.y=h-.75*o.height,ditch.cache(0,0,s.width,s.height);var r={id:"building",width:274,height:126,number:3};buildings=[];for(var d=new createjs.SpriteSheet({images:[loader.getResult(r.id)],frames:{width:r.width,height:r.height}}),c=0;c<=r.number;c++){var u=new createjs.Sprite(d),l=d.getFrameBounds(c);u.gotoAndStop(c),u.setTransform(Math.random()*w,h-(o.height+l.height)+2),buildings.push(u)}var g=new createjs.SpriteSheet({images:[loader.getResult("tree")],frames:{width:100,height:150}});createTreeStrip=function(){for(var e=[],t=0;t<4;t++){var n=new createjs.Sprite(g),a=g.getFrameBounds(t);n.gotoAndStop(t),n.setTransform(Math.random()*w,h-(o.height+a.height)+2),e.push(n)}return e};k=new createjs.SpriteSheet({framerate:3,images:[loader.getResult("amb")],frames:{regX:0,height:150,count:15,regY:0,width:150},animations:{run:[0,4,"run",1.5],hickup:[5,6,"run"],plus:[7,10,"run",6],minus:[11,14,"run",6]}});(ambulance=new createjs.Sprite(k,"run")).x=.1*w,ambulance.y=h-3*o.height,ambulance.setBounds(0,0,150,150);var m=new createjs.SpriteSheet({images:[loader.getResult("ptoken")],frames:{width:47,height:47}}),p=new createjs.SpriteSheet({images:[loader.getResult("ntoken")],frames:{width:47,height:47}});createTokens=function(){for(ptokens=[],t=1;t<=4;t++){var e=new createjs.Sprite(m);e.gotoAndStop(t),ptokens.push(e)}ntokens=[];for(var t=1;t<=2;t++){var n=new createjs.Sprite(p);n.gotoAndStop(t),ntokens.push(n)}},score.ob=new createjs.Text("POINTS:"+score.value,"30px monospace","#00000"),score.ob.x=10,score.ob.y=10,(time=new createjs.Text("00:00:00","30px monospace","#00000")).x=w-150,time.y=10;var k=new createjs.SpriteSheet({images:[loader.getResult("star")],frames:{height:27,width:112}});star.ob=new createjs.Sprite(k),star.ob.numFrames=k.getNumFrames(),star.ob.x=10,star.ob.y=50,stage.addChild(sky,sun,clouds,backBg,frontBg,road,ditch,score.ob,star.ob,time),(treeStrip=createTreeStrip()).forEach(function(e){stage.addChild(e)}),buildings.forEach(function(e){stage.addChild(e)}),createTokens(),stage.addChild(ambulance),createjs.Ticker.timingMode=createjs.Ticker.RAF,createjs.Ticker.interval=100,createjs.Ticker.on("tick",tickHandler),initTweens()}),loader.loadManifest(IMAGES_HOLDER,!0,"../images/"),[{path:"../audio/bg-music.mp3",key:"music",type:"mp3",main:!0},{path:"../audio/got-item.mp3",key:"plusSound",type:"mp3"},{path:"../audio/lost-item.mp3",key:"minusSound",type:"mp3"}].forEach(function(e){createjs.Sound.alternateExtensions=[e.type],e.main&&createjs.Sound.on("fileload",function(){sound=createjs.Sound.play(e.key,{interrupt:createjs.Sound.INTERRUPT_NONE,loop:-1,volume:0})},this),createjs.Sound.registerSound(e.path,e.key)},this)}),dropTokens=function(e){var t=e?ptokens:ntokens,n=t[Math.floor(Math.random()*t.length-1)+1];n.isAnimating||(n.isAnimating=!0,n.notCollectd=!0,n.x=Math.floor(Math.random()*w)+1,n.y=-200,stage.addChild(n),createjs.Tween.get(n).to({y:w},45*speed).call(function(){n.isAnimating=!1,stage.removeChild(n)}))},tokenCollected=function(e,t){if(stage.removeChild(e),e.notCollectd){e.notCollectd=!1,score.value=t?score.value+10:score.value-10,score.ob.text="SCORE:"+score.value;var n=sound.volume*effectVolRatio;t?(tokensCaught<3&&(tokensCaught++,$(document).trigger("hint-indicator-change",[tokensCaught-1])),3===tokensCaught&&$(document).trigger("showhint"),createjs.Sound.play("plusSound",{volume:n}),ambulance.gotoAndPlay("plus"),$(document).trigger("token-caught",[!0])):(createjs.Sound.play("minusSound",{volume:n}),ambulance.gotoAndPlay("minus"),$(document).trigger("token-caught",[!1]))}},hitDitch=function(e){!hitFlags.ditch&&e&&(hitFlags.ditch=!0,ambulance.gotoAndPlay("hickup"),$(document).trigger("hit-ditch"))},$(window).on("keydown",moveSprite),$(window).on("keyup",moveSprite),$("#mute-btn").on("click",function(){createjs.Ticker.getPaused()||$(this).toggleClass("btn-clicked"),$(document).trigger("toggle-mute")}),$("#start-btn").on("click",function(){$(document).trigger("play-pause")}),$(document).on("hit-ditch",function(){$(document).trigger("play-pause"),$(document).trigger("showquestion")}),$(document).on("play-pause",function(){createjs.Ticker.setPaused(!createjs.Ticker.getPaused()),$("#start-btn").toggle(),$(document).trigger("toggle-mute")}),$(document).on("update-star",function(){star.ob.gotoAndStop(++star.ob.currentFrame%star.ob.numFrames)}),$(document).on("toggle-mute",function(){var e=$("#mute-btn");0!=sound.volume||e.hasClass("btn-clicked")||createjs.Ticker.getPaused()?($("#mute-btn").addClass("active"),sound.volume=0):(e.removeClass("active"),sound.volume=playVol)}),$(document).on("plusSound",function(){createjs.Sound.play("plusSound",{volume:playVol*effectVolRatio})}),$(document).on("minusSound",function(){createjs.Sound.play("minusSound",{volume:playVol*effectVolRatio})});var hintDislayed=!1,nextQuestionIndex=0,currectAnswers=0,maxQuestions=5,attemptedQuestions=0,posTokenCount=0,negTokenCount=0,gameOver=!1;$(".modal").modal({dismissible:!1});var resetQuestion=function(e){$(e).removeClass("invalid"),$(e).find("input").prop("checked",!1).removeAttr("disabled")};$(document).on("showhint",function(){if(!hintDislayed){var e=$(".question").eq(nextQuestionIndex).find(".hint").text();""!==e&&(e='<b class="green-text">Hint: </b>'+e,Materialize.toast(e,4e7),hintDislayed=!0)}}),$(document).on("showquestion",function(){$(".question").addClass("hide"),$(".question").eq(nextQuestionIndex).removeClass("hide"),$("#questions-modal").modal("open"),$("#questions-modal").css({display:"block"})}),$("#questionClose").on("click",function(){$(".toast").fadeOut(600,function(){$(".toast").remove()}),$(document).trigger("hint-indicator-change",["RESET"]),$(".question").eq(nextQuestionIndex).hasClass("valid")?(setTimeout(function(){$(document).trigger("update-star"),$(document).trigger("update-star"),currectAnswers===maxQuestions&&($(document).trigger("play-pause"),$(document).trigger("show-loader"),gameOver&&(location.href="/game-over/"+location.pathname.split("/").pop()))},600),$(".question").eq(nextQuestionIndex).remove()):(resetQuestion($(".question").eq(nextQuestionIndex)),$(".question").length===nextQuestionIndex?nextQuestionIndex=0:nextQuestionIndex++),tokensCaught=0,$("#questions-modal").modal("close"),$("#questionClose").attr("disabled",!0),hintDislayed=!1,$(document).trigger("play-pause")}),$(".question input").on("click",function(){$("#questionSubmit").removeAttr("disabled")}),$("#questionSubmit").on("click",function(){var e=$(".question").eq(nextQuestionIndex),t=$(e).find("input:checked").val(),n=$(e).attr("id");$("#questionSubmit").attr("disabled",!0),$(e).find("input").attr("disabled",!0);var o=["a","b","c","d"];$.ajax({method:"POST",url:"/check-answer/"+$("#mute-btn").data("id")+"/"+n,data:{answeredAs:t,Negative_Tokens_Caught__c:negTokenCount,Positive_Tokens_Caught__c:posTokenCount,Time_Taken__c:parseInt((createjs.Ticker.getTime(!0)/1e3).toFixed(0),10),Token_Points__c:10*(posTokenCount-negTokenCount)},cache:!1,success:function(t){attemptedQuestions++,t.answeredCorrect?($(e).addClass("valid"),currectAnswers++,$(document).trigger("plusSound")):($(e).addClass("invalid"),$(document).trigger("minusSound"),$(e).find("p").eq(o.indexOf(t.correctOption)).addClass("correct-answer")),$("#questionClose").removeAttr("disabled"),t.endGame&&(gameOver=!0)},error:function(e){console.info(e)}})}),$(document).on("token-caught",function(e,t){t?posTokenCount++:negTokenCount++}),$(document).on("hint-indicator-change",function(e,t){var n=$(".hit-progress .messages"),o=$(".hit-progress .progress-show .determinate");"RESET"===t?($(n).removeAttr("style"),$(o).removeAttr("style")):($(n).css("margin-top","-"+20*(t+1)+"px"),$(o).eq(t).css("width","99.99%"))}),$(document).on("game-over",function(e,t){"time-out"===t&&$.ajax({url:"/saveAttempt/"+$("#mute-btn").data("id"),method:"POST",cache:!1,data:{Negative_Tokens_Caught__c:negTokenCount,Positive_Tokens_Caught__c:posTokenCount,Token_Points__c:10*(posTokenCount-negTokenCount)},success:function(e){location.href="/game-over/"+location.pathname.split("/").pop()},error:function(e){console.log(e)}})});