import fs from 'node:fs';

// Curated individual words/short expressions visible in the supplied textbook slides.
// Definitions and all exercises below are newly authored for this app.
const material={
  u01:{
    one:[['그동안 어떻게 지냈어요?','How have you been?'],['방학을 잘 보냈어요?','Did you have a good vacation?'],['휴가 때 뭐 했어요?','What did you do on vacation?'],['공부하다','to study'],['운동하다','to exercise']],
    two:[['힘들다','to be difficult or tiring'],['즐겁다','to be enjoyable'],['피곤하다','to be tired'],['재미있다','to be interesting'],['정신이 없다','to be very busy'],['그저 그렇다','to be so-so']],
    q1:['다니엘은 요즘 어떤 일을 해요?',['회사에 다니고 한국어를 배워요.','매일 여행을 해요.','학교에서 운동해요.'],0],
    q2:['다니엘은 일요일에 어떤 날씨였다고 해요?',['비가 왔어요.','눈이 왔어요.','맑았어요.'],0]
  },
  u02:{
    one:[['배드민턴을 치다','to play badminton'],['자전거를 타다','to ride a bicycle'],['등산을 하다','to hike'],['낚시를 하다','to fish'],['피아노를 치다','to play piano'],['게임을 하다','to play games']],
    two:[['언제나','always'],['항상','always'],['가끔','sometimes'],['별로','not much'],['거의','almost'],['전혀','not at all']],
    q1:['준호는 무엇을 할 줄 알아요?',['피아노를 쳐요.','수영을 해요.','낚시를 해요.'],0],
    q2:['준호는 왜 아침에 연습을 못 해요?',['시간이 없어서요.','악기가 없어서요.','날씨가 나빠서요.'],0]
  },
  u03:{
    one:[['불고기','bulgogi'],['설렁탕','beef bone soup'],['삼계탕','ginseng chicken soup'],['갈비','short ribs'],['김치찌개','kimchi stew']],
    two:[['된장찌개','soybean paste stew'],['냉면','cold noodles'],['김밥','gimbap'],['라면','instant noodles'],['떡볶이','spicy rice cakes']],
    q1:['에밀은 점심에 무엇을 먹을래요?',['비빔밥','국수','불고기'],0],
    q2:['에밀은 무엇을 마실래요?',['따뜻한 차','찬 물','주스'],0]
  },
  u04:{
    one:[['기차','train'],['비행기','airplane'],['타다','to ride'],['내리다','to get off'],['갈아타다','to transfer']],
    two:[['타고 가다','to go by vehicle'],['타고 오다','to come by vehicle'],['타고 다니다','to commute by vehicle'],['정류장','bus stop'],['역','station']],
    q1:['도윤은 도서관까지 무엇을 타고 가요?',['버스','택시','비행기'],0],
    q2:['지하철로 도서관까지 얼마나 걸려요?',['이십 분','십 분','한 시간'],0]
  },
  u05:{
    one:[['왼쪽','left'],['오른쪽','right'],['이쪽','this way'],['저쪽','that way'],['똑바로','straight ahead']],
    two:[['올라가다','to go up'],['내려가다','to go down'],['나가다','to go out'],['들어가다','to go in'],['지나다','to pass by']],
    q1:['미술관을 가려면 먼저 어느 쪽으로 가요?',['똑바로 가요.','왼쪽으로 가요.','뒤로 돌아요.'],0],
    q2:['카페에 가려면 길을 건넌 뒤 어디로 가요?',['왼쪽','오른쪽','똑바로'],0]
  },
  u06:{
    one:[['전화를 하다','to make a call'],['전화를 걸다','to place a call'],['전화를 끊다','to hang up'],['음성 메시지를 남기다','to leave a voice message'],['문자 메시지를 보내다','to send a text']],
    two:[['여보세요','hello (on phone)'],['잠깐만 기다리세요','please wait a moment'],['통화 중입니다','the line is busy'],['잘못 걸었습니다','I dialed the wrong number'],['나중에 다시 하겠습니다','I will call again later']],
    q1:['마테오는 지금 왜 통화할 수 없어요?',['회의 중이어서요.','잠을 자서요.','여행 중이어서요.'],0],
    q2:['서연은 번호를 어떻게 알려 줄 거예요?',['문자로 보낼 거예요.','편지로 보낼 거예요.','직접 만날 거예요.'],0]
  },
  u07:{
    one:[['예쁘다','to be pretty'],['멋있다','to be stylish'],['귀엽다','to be cute'],['잘생기다','to be handsome'],['키가 작다','to be short'],['머리가 길다','to have long hair']],
    two:[['셔츠를 입다','to wear a shirt'],['바지를 입다','to wear pants'],['신발을 신다','to wear shoes'],['안경을 쓰다','to wear glasses'],['가방을 들다','to carry a bag'],['넥타이를 매다','to wear a tie']],
    q1:['다혜의 친구는 어떤 옷을 입고 있어요?',['파란 셔츠','빨간 코트','노란 셔츠'],0],
    q2:['다혜의 친구는 누구 옆에 있어요?',['안경 쓴 사람','모자 쓴 사람','검은 가방 든 사람'],0]
  },
  u08:{
    one:[['아버지','father'],['어머니','mother'],['언니','older sister (female speaker)'],['누나','older sister (male speaker)'],['오빠','older brother (female speaker)'],['형','older brother (male speaker)']],
    two:[['계시다','to be (honorific)'],['드시다','to eat (honorific)'],['주무시다','to sleep (honorific)'],['말씀하시다','to speak (honorific)'],['돌아가시다','to pass away (honorific)']],
    q1:['지안 씨의 가족은 몇 명이에요?',['네 명','세 명','다섯 명'],0],
    q2:['지안 씨의 할머니는 어디에 계세요?',['다른 동네','같은 집','외국'],0]
  },
  u09:{
    one:[['아름답다','to be beautiful'],['유명하다','to be famous'],['경치가 좋다','to have nice scenery'],['공기가 맑다','to have clean air'],['사람들이 친절하다','people are kind']],
    two:[['강','river'],['섬','island'],['호수','lake'],['온천','hot spring'],['유적지','historic site'],['민속촌','folk village']],
    q1:['민아는 방학에 어디에 가고 싶어요?',['강릉','서울','부산'],0],
    q2:['민아는 강릉에서 무엇을 먹어 보고 싶어요?',['지역 음식','학교 급식','집밥'],0]
  },
  u10:{
    one:[['얼굴','face'],['눈','eye'],['코','nose'],['입','mouth'],['귀','ear'],['목','throat or neck'],['팔','arm'],['다리','leg']],
    two:[['감기에 걸리다','to catch a cold'],['열이 나다','to have a fever'],['기침을 하다','to cough'],['몸이 안 좋다','to feel unwell'],['낫다','to get better'],['건강하다','to be healthy']],
    q1:['현수는 어디가 아파요?',['머리','다리','배'],0],
    q2:['현수는 언제 약을 먹을 거예요?',['밥을 먹은 후에','밥을 먹기 전에','잠을 자기 전에'],0]
  },
  u11:{
    one:[['케이크','cake'],['꽃','flowers'],['풍선','balloons'],['음료수','drink'],['카메라','camera'],['초대장','invitation']],
    two:[['모임을 준비하다','to prepare a gathering'],['장소를 예약하다','to reserve a place'],['사람들을 초대하다','to invite people'],['시간을 정하다','to set a time'],['회비를 모으다','to collect dues']],
    q1:['정민은 무엇을 예약할 거예요?',['카페','식당','호텔'],0],
    q2:['모임에 몇 명이 와요?',['여섯 명','다섯 명','일곱 명'],0]
  },
  u12:{
    one:[['크다','to be big'],['작다','to be small'],['복잡하다','to be crowded or complex'],['조용하다','to be quiet'],['가깝다','to be near'],['멀다','to be far']],
    two:[['살기 좋다','to be good to live in'],['분위기가 좋다','to have a nice atmosphere'],['높은 건물이 많다','to have many tall buildings'],['인기가 많다','to be popular'],['전통적인 도시다','to be a traditional city']],
    q1:['혜진의 고향은 어디 옆에 있어요?',['바다','산','강'],0],
    q2:['혜진의 집에서 바다까지 얼마나 걸려요?',['걸어서 십 분','걸어서 한 시간','버스로 십 분'],0]
  },
  u13:{
    one:[['기분이 좋다','to feel good'],['기분이 나쁘다','to feel bad'],['기쁘다','to be happy'],['슬프다','to be sad'],['행복하다','to be happy'],['외롭다','to be lonely']],
    two:[['기분 전환을 하다','to refresh oneself'],['공연을 보다','to see a performance'],['수다를 떨다','to chat'],['바람을 쐬다','to get fresh air'],['맛있는 것을 먹다','to eat something tasty']],
    q1:['보라는 요즘 무엇이 많아요?',['스트레스','여행 계획','시간'],0],
    q2:['태오는 가끔 누구를 만나러 가요?',['친구','선생님','가족'],0]
  },
  u14:{
    one:[['한국 친구를 사귀다','to make Korean friends'],['한국 문화에 관심이 있다','to be interested in Korean culture'],['한국으로 여행을 가다','to travel to Korea'],['한국 회사에 취직하다','to get a job at a Korean company']],
    two:[['선생님이 되다','to become a teacher'],['꿈을 이루다','to achieve a dream'],['성공하다','to succeed'],['좋은 사람과 결혼하다','to marry a good person'],['외국 여행을 가다','to travel abroad']],
    q1:['레오는 앞으로 어떤 일을 하고 싶어요?',['사람들을 가르치고 싶어요.','요리사가 되고 싶어요.','여행만 하고 싶어요.'],0],
    q2:['레오는 그 일을 위해 무엇을 연습해요?',['발표','수영','노래'],0]
  }
};

for(const [id,addition] of Object.entries(material)){
  const file=`content/units/${id}.json`;
  const data=JSON.parse(fs.readFileSync(file,'utf8'));
  const original=data.vocabulary.filter(v=>v.source!=='textbook-vocabulary');
  const midpoint=Math.ceil(original.length/2);
  original.forEach((v,i)=>v.part=i<midpoint?1:2);
  const known=new Set(original.map(v=>v.ko));
  let serial=original.length;
  const add=(items,part)=>items.filter(([ko])=>!known.has(ko)).map(([ko,meaning])=>{known.add(ko);serial++;return {id:`${id}-v${String(serial).padStart(2,'0')}`,ko,romanization:'',meaning,audio:null,part,source:'textbook-vocabulary'};});
  data.vocabulary=[...original.filter(v=>v.part===1),...add(addition.one,1),...original.filter(v=>v.part===2),...add(addition.two,2)];
  const question=([text,choices,answer],suffix)=>({id:`${id}-${suffix}`,type:'multiple-choice',question:text,choices,answer,explanation:'대화 내용을 다시 읽고 확인해 보세요.',hint:['대화를 다시 읽어 보세요.','선택지와 대화의 내용을 비교해 보세요.',`정답은 ‘${choices[answer]}’예요.`]});
  data.dialoguePractice={one:{question:question(addition.q1,'practice1'),sentence:data.dialogue.lines[0].text},two:{question:question(addition.q2,'practice2'),sentence:data.dialogue2.lines[0].text}};
  fs.writeFileSync(file,JSON.stringify(data,null,2)+'\n');
}
console.log('Expanded textbook vocabulary and dialogue practices for 14 lessons.');
