import fs from 'node:fs';

const notes={
  '-고':{form:'동사·형용사 어간 + -고',usage:'두 행동이나 상태를 나란히 이어 말합니다. 앞뒤의 주어가 같을 수도, 다를 수도 있습니다.',watchOut:'단순히 이어 말할 때 쓰며, 반드시 원인과 결과를 뜻하지는 않습니다.',example:['저는 음악을 듣고 동생은 책을 읽어요.','I listen to music, and my sibling reads a book.']},
  '그런데':{form:'문장. 그런데 문장.',usage:'앞에서 말한 상황과 다르거나 예상 밖인 내용을 새 문장으로 이어 줍니다.',watchOut:'-고처럼 어간에 붙이지 않고 문장 사이에 따로 씁니다.',example:['날씨가 좋아요. 그런데 바람이 많이 불어요.','The weather is nice. But it is very windy.']},
  '못':{form:'못 + 동사',usage:'능력이나 상황 때문에 어떤 행동을 할 수 없음을 말합니다.',watchOut:'스스로 하지 않기로 한 ‘안’과 구별해 보세요. ‘못 가요’는 갈 수 없다는 뜻입니다.',example:['오늘은 일이 있어서 모임에 못 가요.','I cannot go to the gathering because I have work.']},
  '-아서/어서':{form:'어간의 끝 모음 ㅏ·ㅗ → -아서, 그 밖 → -어서, 하다 → 해서',usage:'앞의 내용이 뒤의 내용의 이유가 될 때 사용합니다.',watchOut:'이유를 말할 때는 앞 절에 보통 과거 시제 -았/었-을 넣지 않습니다.',example:['비가 와서 집에서 쉬어요.','It is raining, so I am resting at home.']},
  '-(으)ㄹ래요':{form:'받침 없거나 ㄹ 받침 → -ㄹ래요, 다른 받침 → -을래요',usage:'하고 싶은 일을 말하거나 상대의 의향을 묻습니다.',watchOut:'명령보다는 선택과 의향을 묻는 느낌입니다.',example:['오늘은 따뜻한 차를 마실래요.','I would like to drink warm tea today.']},
  '무슨':{form:'무슨 + 명사',usage:'종류나 내용을 모를 때 명사 앞에 놓아 묻습니다.',watchOut:'‘무엇’은 명사처럼 쓰고, ‘무슨’은 뒤에 명사가 필요합니다.',example:['무슨 영화를 보고 싶어요?','What kind of movie do you want to watch?']},
  '이/가 걸리다':{form:'시간 + 이/가 걸리다',usage:'어떤 곳에 가거나 일을 끝내는 데 필요한 시간을 말합니다.',watchOut:'‘어디에 가요?’가 아니라 ‘얼마나 걸려요?’가 걸리는 시간을 묻는 질문입니다.',example:['집에서 역까지 십 분이 걸려요.','It takes ten minutes from home to the station.']},
  '-에서 -까지':{form:'출발 장소 + 에서, 도착 장소 + 까지',usage:'이동의 시작점과 끝점을 함께 나타냅니다.',watchOut:'시간의 시작을 말할 때는 보통 ‘부터’를 씁니다.',example:['학교에서 공원까지 걸어가요.','I walk from school to the park.']},
  '(으)로':{form:'받침 없거나 ㄹ 받침 → 로, 다른 받침 → 으로',usage:'움직이는 방향이나 목적지 쪽을 나타냅니다.',watchOut:'정확한 도착 위치보다 ‘어느 방향으로’ 움직이는지에 초점을 둡니다.',example:['다음 길에서 왼쪽으로 도세요.','Turn left at the next road.']},
  '-아/어서':{form:'어간의 끝 모음 ㅏ·ㅗ → -아서, 그 밖 → -어서, 하다 → 해서',usage:'앞의 동작을 한 뒤 이어서 하는 동작을 연결합니다.',watchOut:'두 행동이 자연스럽게 이어지는 순서를 나타냅니다.',example:['문을 열어서 안으로 들어가세요.','Open the door and go inside.']},
  '-아/어 주다':{form:'동사 어간 + -아/어 주다',usage:'다른 사람을 위해 행동하거나 부탁할 때 씁니다.',watchOut:'공손한 부탁은 ‘-아/어 주세요’ 형태로 말할 수 있습니다.',example:['이 주소를 문자로 보내 주세요.','Please send me this address by text.']},
  '-지요?':{form:'동사·형용사·이다 어간 + -지요?',usage:'이미 알고 있다고 생각하는 사실을 상대에게 확인합니다.',watchOut:'대화에서는 ‘-죠?’로 줄여 말하기도 합니다.',example:['내일 수업이 있지요?','We have class tomorrow, right?']},
  '-(으)ㄴ':{form:'형용사 어간: 받침 없으면 -ㄴ, 받침 있으면 -은',usage:'형용사가 명사 바로 앞에서 사람이나 사물의 특징을 설명합니다.',watchOut:'‘예쁘다 사람’이 아니라 ‘예쁜 사람’이라고 합니다.',example:['긴 머리를 한 분이 제 선생님이에요.','The person with long hair is my teacher.']},
  '-고 있다':{form:'동사 어간 + -고 있다',usage:'지금 진행되는 행동을 말합니다. 입다·쓰다 등의 옷차림을 묘사할 때도 자주 씁니다.',watchOut:'‘입고 있어요’는 지금 입는 동작뿐 아니라 입은 상태를 나타낼 수 있습니다.',example:['저기 앉아 있는 사람이 안경을 쓰고 있어요.','The person sitting there is wearing glasses.']},
  '의':{form:'소유자·관계 명사 + 의 + 다른 명사',usage:'누구의 것인지, 어떤 관계인지 나타냅니다.',watchOut:'일상 대화에서는 ‘저의’를 ‘제’로 줄여 말하는 경우가 많습니다.',example:['이것은 제 동생의 가방이에요.','This is my younger sibling’s bag.']},
  '-(으)시-':{form:'동사·형용사 어간 + -(으)시- + 어미',usage:'동작을 하는 주어가 높여야 할 사람일 때 사용합니다.',watchOut:'어른에게 말하는 것만으로는 부족합니다. 높이는 대상이 문장의 주어인지 확인하세요.',example:['할머니께서는 매일 아침 산책하세요.','My grandmother takes a walk every morning.']},
  '-아/어 보다':{form:'동사 어간 + -아/어 보다',usage:'어떤 일을 시도하거나 해 본 경험을 말합니다.',watchOut:'‘가 봤어요’는 직접 그 장소에 가 본 경험입니다.',example:['한국 음식을 직접 만들어 봤어요.','I have tried making Korean food myself.']},
  '-고 싶다':{form:'동사 어간 + -고 싶다',usage:'하고 싶은 행동이나 가고 싶은 장소를 말합니다.',watchOut:'대화에서 자신의 바람은 ‘-고 싶어요’로 자연스럽게 말합니다.',example:['다음 주말에는 바다를 보고 싶어요.','I want to see the sea next weekend.']},
  '-지 말다':{form:'동사 어간 + -지 마세요',usage:'상대에게 어떤 행동을 하지 말라고 조언하거나 부탁합니다.',watchOut:'‘가지 마세요’처럼 동사 뒤에 붙입니다. ‘못’과 의미가 다릅니다.',example:['몸이 안 좋으면 무리하지 마세요.','If you feel unwell, do not overexert yourself.']},
  '-(으)ㄴ 후에':{form:'동사 어간: 받침 없으면 -ㄴ 후에, 받침 있으면 -은 후에',usage:'한 일이 끝난 다음에 다른 일을 한다고 말합니다.',watchOut:'순서를 분명히 합니다. 앞의 일이 먼저 끝납니다.',example:['운동한 후에 물을 마셔요.','I drink water after exercising.']},
  '-아야/어야 하다':{form:'동사 어간 + -아야/어야 하다',usage:'반드시 해야 하는 일이나 의무를 말합니다.',watchOut:'‘-고 싶다’는 바람, ‘-아야/어야 하다’는 필요나 의무입니다.',example:['손님이 오기 전에 방을 치워야 해요.','We have to tidy the room before guests arrive.']},
  '-(으)ㄹ게요':{form:'받침 없거나 ㄹ 받침 → -ㄹ게요, 다른 받침 → -을게요',usage:'상대와 관계된 자신의 의지나 약속을 말합니다.',watchOut:'보통 말하는 사람의 행동에 사용하며, 질문형으로 상대에게 묻지 않습니다.',example:['제가 친구들에게 연락할게요.','I will contact the friends.']},
  '-지만':{form:'동사·형용사 어간 + -지만',usage:'앞뒤의 내용이 서로 다르거나 반대될 때 사용합니다.',watchOut:'‘그런데’는 문장 사이의 말이고, ‘-지만’은 앞말에 붙는 어미입니다.',example:['우리 동네는 작지만 편리해요.','My neighborhood is small but convenient.']},
  '보다':{form:'비교 기준 명사 + 보다',usage:'둘을 비교할 때 기준이 되는 대상 뒤에 붙입니다.',watchOut:'‘서울보다 조용해요’는 서울을 기준으로 더 조용하다는 뜻입니다.',example:['이 공원은 저 공원보다 넓어요.','This park is wider than that park.']},
  '-(으)ㄹ 때':{form:'어간: 받침 없거나 ㄹ 받침 → -ㄹ 때, 다른 받침 → -을 때',usage:'어떤 상황이나 시간이 일어날 때 하는 행동을 말합니다.',watchOut:'‘때’ 앞의 표현을 한 덩어리로 읽어 보세요.',example:['기분이 좋을 때 노래를 들어요.','I listen to music when I am happy.']},
  '-(으)러 가다':{form:'동사 어간: 받침 없거나 ㄹ 받침 → -러, 다른 받침 → -으러 + 가다',usage:'어떤 일을 하기 위해 장소로 이동한다고 말합니다.',watchOut:'앞에는 목적이 되는 행동, 뒤에는 가다·오다 같은 이동 동사가 옵니다.',example:['친구를 만나러 도서관에 가요.','I go to the library to meet a friend.']},
  '-(으)려고':{form:'동사 어간: 받침 없거나 ㄹ 받침 → -려고, 다른 받침 → -으려고',usage:'앞의 행동을 하려는 목적이나 계획을 나타냅니다.',watchOut:'목적을 나타내므로 뒤에는 그 목적을 이루기 위한 행동이 이어집니다.',example:['시험을 준비하려고 매일 복습해요.','I review every day to prepare for the exam.']},
  '-(으)면':{form:'어간: 받침 없거나 ㄹ 받침 → -면, 다른 받침 → -으면',usage:'어떤 조건이 이루어졌을 때의 결과를 말합니다.',watchOut:'확정된 사실이 아니라 조건이나 가능성을 말할 때 자주 씁니다.',example:['시간이 있으면 같이 점심을 먹어요.','If you have time, let’s have lunch together.']}
};

for(let i=1;i<=14;i++){
  const file=`content/units/u${String(i).padStart(2,'0')}.json`;
  const unit=JSON.parse(fs.readFileSync(file,'utf8'));
  for(const grammar of unit.grammar){
    const detail=notes[grammar.pattern];
    if(!detail)throw Error(`Missing grammar detail: ${grammar.pattern}`);
    grammar.details={form:detail.form,usage:detail.usage,watchOut:detail.watchOut};
    const [ko,meaning]=detail.example;
    if(!grammar.examples.some(example=>example.ko===ko))grammar.examples.push({ko,meaning});
  }
  fs.writeFileSync(file,JSON.stringify(unit,null,2)+'\n');
}
console.log('Added form, use, caution, and extra example for every grammar point.');
