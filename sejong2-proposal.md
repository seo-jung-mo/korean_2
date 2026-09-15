# 세종한국어2 과정 설계 제안

## 현재 상태와 범위

작업 폴더에는 작업지시서와 `세종한국어2_어휘색인.pdf`만 있으며, 지시서가 전제한 기존 ‘왕초보’ 앱 소스는 없다. 따라서 기존 컴포넌트 재사용 여부와 실제 라우트 경로는 소스가 제공된 뒤 확정한다. 아래는 기존 앱에 결합할 수 있도록 데이터와 화면 책임을 분리한 제안이다.

## 1. JSON 콘텐츠 스키마

`content/sejong2/manifest.json`은 학습 순서, 잠금 조건, 콘텐츠 경로만 관리한다. 각 단원은 별도 `units/{id}.json`에 저장한다. 단원 ID는 `u01`~`u14`, 문화 코너는 `c01`~`c04`를 사용한다. 이렇게 하면 3과 뒤 문화1처럼 숫자 과와 문화 코너를 정확히 끼워 넣을 수 있다.

```json
{
  "courseId": "sejong2",
  "title": "세종한국어2 기반 초급",
  "units": [
    { "unitId": "u01", "title": "안부", "kind": "lesson", "unlockAfter": null, "content": "units/u01.json" },
    { "unitId": "u02", "title": "취미 활동", "kind": "lesson", "unlockAfter": "u01", "content": "units/u02.json" },
    { "unitId": "u03", "title": "음식 문화1: 한국 음식", "kind": "lesson", "unlockAfter": "u02", "content": "units/u03.json" },
    { "unitId": "c01", "title": "한국 음식", "kind": "culture", "unlockAfter": "u03", "content": "units/c01.json" }
  ]
}
```

실제 manifest에는 `u04 교통 → u05 길 찾기 → u06 전화 → c02 한국의 대중교통 → u07 외모 → u08 가족 → u09 여행 → c03 한국의 여행지 → u10 건강 → u11 모임 → u12 고향 → c04 한국 사람들의 모임 → u13 기분과 감정 → u14 미래`가 이어진다. 이는 작업지시서의 순서를 그대로 따른다.

일반 단원 파일은 다음 구조를 따른다. `vocabulary`, `grammar`, `dialogue`, `quiz`를 필수로 두고 오디오 파일이 없을 때는 `null`을 사용한다. 로마자 표기는 보조 정보이며 화면에서 끌 수 있다.

```json
{
  "unitId": "u01",
  "title": "안부",
  "kind": "lesson",
  "vocabulary": [
    { "id": "u01-v01", "ko": "잘 지내요?", "romanization": "jal jinaeyo?", "meaning": "How are you?", "audio": null }
  ],
  "grammar": [
    { "id": "u01-g01", "pattern": "-아요/어요", "explanation": "친근하고 공손하게 현재 상태를 말해요.", "examples": ["요즘 바빠요."] }
  ],
  "dialogue": {
    "audio": null,
    "lines": [
      { "speaker": "A", "text": "요즘 어떻게 지내요?", "meaning": "How have you been lately?" },
      { "speaker": "B", "text": "잘 지내요. 요즘 조금 바빠요.", "meaning": "I'm well. I've been a little busy lately." }
    ]
  },
  "quiz": [
    { "id": "u01-q01", "type": "multiple-choice", "question": "‘요즘 어떻게 지내요?’에 알맞은 대답은?", "choices": ["잘 지내요.", "내일 만나요.", "커피를 마셔요."], "answer": 0, "explanation": "안부를 묻는 말에는 현재 상태로 답해요." }
  ],
  "minigames": [
    { "type": "matching", "pairs": [["잘 지내요?", "How are you?"]] }
  ],
  "rewards": { "xpOnComplete": 50, "badge": "안부 첫걸음" }
}
```

예문과 대화는 교재 문장을 옮기지 않고 새로 쓴다. 어휘 색인은 단원 어휘를 선정할 때 참조하되, 각 항목의 단원 대응과 표기를 검토한 후 JSON에 반영한다. 문화 코너는 같은 기본 필드를 유지하되 `vocabulary: []`, `grammar: []`, `dialogue: { "audio": null, "lines": [] }`, `quiz: []`로 두고, `reading`과 단일 `comprehension` 문항을 추가한다. 문화 코너 화면은 일반 퀴즈 화면을 거치지 않는다.

## 2. 화면 라우팅 구조

기존 앱의 레벨 선택 화면에 ‘세종한국어2’ 카드를 추가하고, 실제 URL 규칙은 기존 라우터에 맞춰 연결한다. 아래 경로는 제안이다.

| 경로 | 역할 |
| --- | --- |
| `/levels` | 왕초보·세종한국어2 선택 |
| `/sejong2` | 과정 개요, 진단 배치고사, 이어 하기, 복습 큐 |
| `/sejong2/units` | 18개 카드 목록과 잠금·완료 상태 |
| `/sejong2/units/:unitId/vocabulary` | 어휘 카드, 발음, SRS 등록 |
| `/sejong2/units/:unitId/grammar` | 문법 설명과 예문 |
| `/sejong2/units/:unitId/dialogue` | 대화 읽기·듣기·문장 조합 |
| `/sejong2/units/:unitId/quiz` | 정답 확인, 3단계 힌트, 즉시 피드백 |
| `/sejong2/units/:unitId/result` | 완료 판정, XP·배지, 다음 과 안내 |
| `/sejong2/culture/:unitId` | 문화 읽기와 이해도 1문항 |
| `/sejong2/review` | 오늘의 SRS 복습 |

일반 과의 흐름은 **어휘 → 문법 → 대화 → 퀴즈 → 결과**이며, 문화 코너는 **읽기 → 이해도 확인 → 결과**다. 카드 잠금은 직전 항목의 완료 기록으로 판단한다. 자유 탐색 모드에서는 잠긴 콘텐츠를 미리 볼 수 있지만, 완료·XP·다음 과 해제는 정식 학습 흐름의 정답 검증 후에만 기록한다.

## 학습 상태와 보상

진도는 `courseId`, `unitId`, `step`, `completedAt`, `quizScore`, `attempts`로 저장한다. 어휘 복습 상태는 어휘 ID별 `dueAt`, `interval`, `ease`, `lastResult`로 분리한다. 첫 학습 또는 오답 어휘는 복습 큐에 자동 등록하고, 복습 정답 여부에 따라 다음 간격을 갱신한다. 같은 완료 이벤트의 XP 중복 지급을 막기 위해 `courseId + unitId + rewardType`을 보상 고유 키로 사용한다. 스트릭은 실제 학습 정답 기록이 발생한 날짜에만 갱신한다.

배치고사는 1과 진입 전 선택적으로 제공한다. 결과는 추천 시작 단원을 제시하지만, 순차 해제 규칙을 임의로 우회하지 않는다. 음성 파일이 없는 항목은 재생 버튼을 숨기고 텍스트 학습을 유지한다.

## 구현 시작 전 필요한 입력

기존 ‘왕초보’ 앱의 소스 위치 또는 저장소가 필요하다. 제공된 폴더에는 앱 코드가 없어 컴포넌트 재사용과 라우터 결합을 지금 검증할 수 없다. 설계 확인 후 기존 앱 코드를 받으면 1과부터 구현한다.
