import fs from 'node:fs';

// Freshly written activities following the book's dialogue → listening/speaking → reading/writing rhythm.
const extra = {
  u01: {
    scene2:[['하나','지난주에는 무엇을 했어요?','What did you do last week?'],['다니엘','집을 청소하고 친구를 만났어요. 그런데 일요일에는 비가 왔어요.','I cleaned the house and met a friend. But it rained on Sunday.'],['하나','그랬군요. 요즘은 좀 쉬어요?','I see. Are you resting these days?']],
    listening:'오랜만에 친구를 만났어요. 저는 요즘 회사에 다니고 저녁에는 한국어를 공부해요. 그런데 주말에는 시간이 있어요.',
    listenQuestion:['이 사람은 주말에 시간이 있어요?',['네, 있어요.','아니요, 없어요.','알 수 없어요.'],0],
    speaking:'오랜만에 만난 친구에게 안부를 묻고, 요즘 하는 일 두 가지를 -고로 이어 말해 보세요.',
    reading:'어제 대학 친구에게 연락이 왔어요. 우리는 오랜만에 만나서 산책하고 차를 마셨어요. 친구는 요즘 새 일을 시작했어요. 그런데 아직 바빠서 주말에도 일을 해요. 다음 달에는 같이 영화를 보기로 했어요.',
    readQuestion:['두 사람은 다음 달에 무엇을 할 거예요?',['영화를 볼 거예요.','새 일을 시작할 거예요.','주말에 일할 거예요.'],0],
    writing:'오랜만에 연락하는 친구에게 3~4문장으로 안부 메시지를 써 보세요. ‘요즘’과 ‘그런데’를 한 번씩 사용해 보세요.'
  },
  u02: {
    scene2:[['나영','피아노는 언제 연습해요?','When do you practice piano?'],['준호','저녁에 해요. 아침에는 시간이 없어서 못 해요.','In the evening. I cannot in the morning because I have no time.'],['나영','저도 아침에는 운동을 못 해요.','I cannot exercise in the morning either.']],
    listening:'제 취미는 사진 찍기예요. 토요일에 공원에 가서 사진을 찍어요. 비가 오면 밖에 못 가서 집에서 그림을 그려요.',listenQuestion:['비가 오면 무엇을 해요?',['집에서 그림을 그려요.','공원에서 사진을 찍어요.','수영을 해요.'],0],speaking:'잘하는 취미 하나와 못하는 활동 하나를 친구에게 이야기해 보세요.',reading:'저는 일요일마다 친구와 배드민턴을 쳐요. 운동을 좋아해서 매주 만나요. 지난주에는 비가 많이 와서 밖에서 못 했어요. 그래서 실내 체육관을 찾아갔어요.',readQuestion:['지난주에는 왜 밖에서 운동하지 못했어요?',['비가 와서요.','친구가 없어서요.','시간이 없어서요.'],0],writing:'자신의 취미와 자주 하는 시간을 3문장으로 써 보세요.'
  },
  u03: {
    scene2:[['지수','음료는 무엇을 마실래요?','What would you like to drink?'],['에밀','따뜻한 차를 마실래요. 매운 음식을 먹어서 목이 말라요.','I would like warm tea. I am thirsty after spicy food.'],['지수','저도 같은 것으로 주문할게요.','I will order the same.']],
    listening:'오늘 점심에는 국수를 먹을래요. 이 식당의 국수는 맵지 않고 국물이 따뜻해요. 음료는 물을 마실 거예요.',listenQuestion:['점심에 무엇을 먹을래요?',['국수','비빔밥','김밥'],0],speaking:'식당에서 음식과 음료를 하나씩 주문하는 말을 해 보세요.',reading:'새로 생긴 작은 식당에 갔어요. 메뉴에는 밥과 국수, 여러 음료가 있었어요. 저는 맵지 않은 국수를 골랐어요. 친구는 채소가 많은 밥을 먹었어요. 둘 다 맛있어서 다음에 또 가기로 했어요.',readQuestion:['친구는 무엇을 먹었어요?',['채소가 많은 밥','맵지 않은 국수','따뜻한 차'],0],writing:'좋아하는 음식의 맛과 다음에 주문하고 싶은 음식을 소개해 보세요.'
  },
  u04: {
    scene2:[['리나','지하철은 오래 걸려요?','Does the subway take long?'],['도윤','여기에서 도서관까지 이십 분이 걸려요. 버스가 조금 빨라요.','It takes twenty minutes from here to the library. The bus is a little faster.'],['리나','그럼 버스를 탈게요.','Then I will take the bus.']],
    listening:'학교에서 박물관까지 버스로 삼십 분이 걸려요. 지하철은 이십 분이 걸려요. 저는 지하철을 탈 거예요.',listenQuestion:['더 빨리 가는 교통수단은?',['지하철','버스','택시'],0],speaking:'집에서 자주 가는 곳까지 어떻게 가고 얼마나 걸리는지 말해 보세요.',reading:'저는 아침에 집에서 회사까지 지하철을 타요. 지하철역은 집에서 걸어서 오 분이에요. 지하철을 타면 회사까지 이십오 분이 걸려요. 비가 오는 날에는 역까지 버스를 타기도 해요.',readQuestion:['집에서 역까지 걸어서 얼마나 걸려요?',['오 분','이십오 분','한 시간'],0],writing:'자신이 자주 이용하는 교통수단과 걸리는 시간을 써 보세요.'
  },
  u05: {
    scene2:[['유진','미술관 앞에 카페도 있어요?','Is there a café in front of the museum too?'],['현우','네, 길을 건너서 왼쪽으로 가면 있어요.','Yes, cross the road and go left.'],['유진','미술관을 본 후에 가 볼게요.','I will visit after seeing the museum.']],
    listening:'버스 정류장에서 똑바로 가세요. 첫 번째 사거리에서 오른쪽으로 도세요. 약국 옆에 도서관이 있어요.',listenQuestion:['도서관은 무엇 옆에 있어요?',['약국','학교','은행'],0],speaking:'가까운 가게나 학교까지 가는 길을 오른쪽·왼쪽을 써서 알려 주세요.',reading:'새 도서관은 지하철역에서 가까워요. 역의 2번 출구로 나와서 똑바로 걸으세요. 작은 다리를 건넌 뒤 왼쪽으로 도세요. 공원 옆의 흰 건물이 도서관이에요.',readQuestion:['다리를 건넌 뒤 어느 쪽으로 돌아요?',['왼쪽','오른쪽','뒤쪽'],0],writing:'역에서 자신이 좋아하는 장소까지 가는 길을 순서대로 써 보세요.'
  },
  u06: {
    scene2:[['서연','제 번호를 저장했어요?','Did you save my number?'],['마테오','아직 못 했어요. 번호를 다시 알려 주시겠어요?','Not yet. Could you tell me the number again?'],['서연','네, 문자로 보내 줄게요.','Yes, I will send it by text.']],
    listening:'지금은 전화를 받을 수 없어요. 오후 세 시에 다시 전화해 주세요. 급한 일이면 문자 메시지를 보내 주세요.',listenQuestion:['언제 다시 전화하면 돼요?',['오후 세 시','오전 세 시','내일 아침'],0],speaking:'친구가 전화를 받지 않을 때 남길 짧은 메시지를 말해 보세요.',reading:'지연 씨가 친구에게 전화를 했지만 친구는 받지 않았어요. 그래서 “오늘 모임이 여섯 시에 시작해요. 늦으면 연락해 주세요”라고 메시지를 보냈어요. 잠시 후 친구에게서 “알겠어요”라는 답장이 왔어요.',readQuestion:['모임은 언제 시작해요?',['여섯 시','세 시','일곱 시'],0],writing:'친구에게 약속 시간과 장소를 알려 주는 짧은 문자를 써 보세요.'
  },
  u07: {
    scene2:[['다혜','모자를 쓴 사람인가요?','Is it the person wearing a hat?'],['민호','아니요, 안경을 쓰고 있는 사람 옆에 있어요.','No, they are next to the person wearing glasses.'],['다혜','아, 찾았어요!','Ah, I found them!']],
    listening:'제 친구는 키가 크고 긴 머리를 하고 있어요. 오늘은 초록색 코트를 입고 검은 가방을 들고 있어요.',listenQuestion:['친구는 무슨 색 코트를 입었어요?',['초록색','파란색','빨간색'],0],speaking:'주변 사람 한 명의 머리 모양과 옷차림을 설명해 보세요.',reading:'현관에서 기다리는 사람은 제 동생이에요. 동생은 키가 작고 짧은 머리를 하고 있어요. 오늘은 노란 운동화를 신고 있어요. 손에는 커다란 책을 들고 있어요.',readQuestion:['동생은 무엇을 신고 있어요?',['노란 운동화','검은 구두','파란 신발'],0],writing:'친구가 찾을 수 있도록 한 사람의 외모와 옷차림을 써 보세요.'
  },
  u08: {
    scene2:[['소라','할머니도 같이 사세요?','Does your grandmother live with you too?'],['지안','아니요, 다른 동네에 계세요. 주말에 자주 찾아가요.','No, she lives in another neighborhood. We visit often on weekends.'],['소라','할머니께서는 무엇을 좋아하세요?','What does your grandmother like?']],
    listening:'우리 가족은 다섯 명이에요. 부모님과 언니, 남동생이 있어요. 아버지는 음악을 좋아하시고 어머니는 요리를 잘하세요.',listenQuestion:['이 가족은 몇 명이에요?',['다섯 명','네 명','여섯 명'],0],speaking:'가족 한 분을 소개하고 좋아하시는 일을 말해 보세요.',reading:'제 가족은 세 명이에요. 어머니와 형, 그리고 저예요. 어머니는 아침에 일찍 일어나세요. 형은 대학에 다니고 저는 회사에 다녀요. 일요일에는 함께 저녁을 만들어요.',readQuestion:['가족은 일요일에 무엇을 해요?',['저녁을 만들어요.','산에 가요.','영화를 봐요.'],0],writing:'가족 구성원과 한 분의 일상을 높임말로 써 보세요.'
  },
  u09: {
    scene2:[['다니엘','강릉에서는 무엇을 해 보고 싶어요?','What do you want to try in Gangneung?'],['민아','바닷가를 걷고 지역 음식을 먹어 보고 싶어요.','I want to walk by the sea and try local food.'],['다니엘','기차표를 미리 예약하세요.','Book your train ticket in advance.']],
    listening:'작년에 친구와 산에 가 봤어요. 아침에 올라가서 오후에 내려왔어요. 다음 여행에는 바다에 가고 싶어요.',listenQuestion:['다음에는 어디에 가고 싶어요?',['바다','산','도서관'],0],speaking:'가 본 여행지 하나와 앞으로 가고 싶은 곳 하나를 말해 보세요.',reading:'지난달에 가족과 작은 바닷가 마을을 여행했어요. 아침에는 해변을 걷고 오후에는 시장을 구경했어요. 신선한 음식을 먹어 봤는데 아주 맛있었어요. 다음에는 여름에 다시 가고 싶어요.',readQuestion:['오후에는 무엇을 했어요?',['시장을 구경했어요.','해변을 걸었어요.','집에 갔어요.'],0],writing:'기억에 남는 여행 경험과 다음 여행 계획을 4문장으로 써 보세요.'
  },
  u10: {
    scene2:[['아린','약은 드셨어요?','Did you take medicine?'],['현수','아직 안 먹었어요. 밥을 먹은 후에 먹을 거예요.','Not yet. I will take it after eating.'],['아린','네, 오늘은 무리하지 마세요.','Okay, do not overdo it today.']],
    listening:'목이 아파서 병원에 갔어요. 의사가 물을 많이 마시고 푹 쉬라고 했어요. 약은 밥을 먹은 후에 먹어요.',listenQuestion:['약은 언제 먹어요?',['밥을 먹은 후에','밥을 먹기 전에','잠자기 전에'],0],speaking:'몸이 아픈 친구에게 두 가지 건강 조언을 해 보세요.',reading:'준서는 요즘 밤늦게까지 일했어요. 그래서 아침마다 피곤했어요. 오늘은 일을 일찍 끝내고 집에서 쉬려고 해요. 저녁을 먹은 후에 따뜻한 차를 마실 거예요.',readQuestion:['준서는 왜 피곤했어요?',['밤늦게까지 일해서','운동을 많이 해서','여행을 해서'],0],writing:'건강을 위해 하는 습관과 하지 말아야 할 일을 써 보세요.'
  },
  u11: {
    scene2:[['윤아','모임에 몇 명이 와요?','How many people are coming to the gathering?'],['정민','여섯 명이에요. 그래서 큰 탁자를 예약해야 해요.','Six people. So we need to reserve a large table.'],['윤아','제가 음식도 조금 준비할게요.','I will prepare some food too.']],
    listening:'금요일 저녁 일곱 시에 친구들과 모여요. 저는 장소를 예약할게요. 선우 씨는 친구들을 초대해 주세요.',listenQuestion:['모임은 언제예요?',['금요일 저녁 일곱 시','토요일 아침 일곱 시','목요일 저녁 여섯 시'],0],speaking:'모임을 준비하며 장소 예약과 친구 연락을 누가 할지 정해 보세요.',reading:'이번 주 일요일에 작은 독서 모임이 있어요. 참석할 사람은 다섯 명이에요. 지수 씨는 책을 준비하고, 태오 씨는 장소를 예약할 거예요. 모두 읽고 싶은 책 한 권을 가져와야 해요.',readQuestion:['태오 씨는 무엇을 할 거예요?',['장소를 예약할 거예요.','책을 준비할 거예요.','음식을 만들 거예요.'],0],writing:'친구에게 모임의 시간·장소·준비물을 알려 주는 초대 메시지를 써 보세요.'
  },
  u12: {
    scene2:[['루카','바다는 여기보다 가까워요?','Is the sea closer than here?'],['혜진','네, 집에서 걸어서 십 분이에요.','Yes, it is ten minutes on foot from my home.'],['루카','그곳에서 살고 싶어요.','I would like to live there.']],
    listening:'제 고향은 시골이에요. 도시보다 조용하지만 주말에는 시장이 아주 활기차요. 저는 그 시장을 좋아해요.',listenQuestion:['고향은 도시보다 어때요?',['조용해요.','복잡해요.','커요.'],0],speaking:'고향과 지금 사는 곳을 두 가지 기준으로 비교해 보세요.',reading:'제 고향에는 오래된 강이 있어요. 강 옆에는 작은 공원이 있고 나무가 많아요. 큰 도시보다 조용하지만 버스가 많지 않아요. 그래도 저는 고향의 맑은 공기가 좋아요.',readQuestion:['고향에서 불편한 점은?',['버스가 많지 않아요.','공기가 나빠요.','나무가 없어요.'],0],writing:'고향의 좋은 점과 다른 도시와 다른 점을 -지만과 보다로 써 보세요.'
  },
  u13: {
    scene2:[['보라','스트레스가 많을 때 음악도 들어요?','Do you listen to music when stressed?'],['태오','네, 좋아하는 노래를 들어요. 가끔 친구를 만나러 가요.','Yes, I listen to songs I like. Sometimes I go to meet a friend.'],['보라','저도 오늘 친구를 만나러 갈래요.','I want to go meet a friend today too.']],
    listening:'시험이 끝나서 오늘은 기분이 좋아요. 친구를 만나러 갈 거예요. 같이 저녁을 먹고 산책도 할 거예요.',listenQuestion:['오늘 기분이 좋은 이유는?',['시험이 끝나서','친구가 아파서','비가 와서'],0],speaking:'기분이 좋을 때와 좋지 않을 때 각각 무엇을 하는지 말해 보세요.',reading:'지민은 어제 일이 많아서 기분이 좋지 않았어요. 저녁에 좋아하는 음악을 듣고 공원에 걸으러 갔어요. 잠깐 쉬고 나니 마음이 편해졌어요. 오늘은 친구에게도 안부를 물었어요.',readQuestion:['지민은 기분을 바꾸려고 어디에 갔어요?',['공원','회사','식당'],0],writing:'최근의 기분과 그럴 때 한 행동을 4문장으로 써 보세요.'
  },
  u14: {
    scene2:[['나래','그 일을 하려고 무엇을 준비해요?','What are you preparing to do that job?'],['레오','매일 책을 읽고 발표를 연습해요.','I read books and practice presentations every day.'],['나래','열심히 하면 좋은 선생님이 될 거예요.','If you work hard, you will become a good teacher.']],
    listening:'제 꿈은 작은 가게를 여는 거예요. 돈을 모으려고 주말에도 일해요. 가게를 열면 친구들을 먼저 초대하고 싶어요.',listenQuestion:['이 사람은 왜 주말에도 일해요?',['돈을 모으려고','친구를 만나려고','책을 읽으려고'],0],speaking:'미래의 꿈과 그 꿈을 이루려고 지금 하는 일을 말해 보세요.',reading:'민재는 나중에 여행 작가가 되고 싶어요. 다양한 곳을 보려고 주말마다 짧은 여행을 해요. 여행에서 본 것을 매일 글로 적어요. 좋은 글을 많이 쓰면 언젠가 책을 낼 수 있을 거라고 생각해요.',readQuestion:['민재는 주말마다 왜 여행해요?',['다양한 곳을 보려고','일을 쉬려고','친구를 만나려고'],0],writing:'미래에 하고 싶은 일과 그것을 이루기 위한 현재의 계획을 써 보세요.'
  }
};

for(const [id,x] of Object.entries(extra)) {
  const file=`content/units/${id}.json`;
  const data=JSON.parse(fs.readFileSync(file,'utf8'));
  data.dialogue2={audio:null,lines:x.scene2.map(([speaker,text,meaning])=>({speaker,text,meaning}))};
  const makeQuestion=([question,choices,answer],suffix)=>({id:`${id}-${suffix}`,type:'multiple-choice',question,choices,answer,explanation:'활동의 내용을 다시 확인해 보세요.',hint:['내용을 다시 읽거나 들어 보세요.','선택지와 내용을 비교해 보세요.',`정답은 ‘${choices[answer]}’예요.`]});
  data.listening={script:x.listening,question:makeQuestion(x.listenQuestion,'listen')};
  data.speaking={prompt:x.speaking};
  data.reading={text:x.reading,question:makeQuestion(x.readQuestion,'read')};
  data.writing={prompt:x.writing};
  fs.writeFileSync(file,JSON.stringify(data,null,2)+'\n');
}
console.log('Added second dialogues and four skills to 14 lessons.');
