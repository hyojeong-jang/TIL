# Asyncronous

##### 비동기 톺아보기. 그 특성을 고려하며 node.js를 사용하기 위하여

### 먼저 Node.js의 동작부터

1.  Event Loop는 요청을 처리하기위해 내부에서 약간의 thread와 프로세스를 사용한다. 이는 non-blocking IO 또는 내부 처리를 위한 목적으로 사용되고 요청 처리를 thread로 처리하지는 않음. 따라서 Multi-Thread 방식의 서버보다 thread와 오버헤드의 수가 훨씬 적다.

2.  Event Loop는 Single-Thread로 이루어져있으므로 CPU 소모가 큰 작업일 경우 전체 서버 성능에 영향을 줌.

### Event Loop

- '먼저 Node.js의 동작부터' 단락의 1번에 대한 내용을 보면서 Event Loop 구조와 대해 정확한 처리 방식에 대해 호기심이 생겼다.
- Event Loop는 자바스크립트 V8 엔진 내부에 존재하는 것이 아닌, 코드를 실행하기 위해 자바스크립트 V8 엔진을 사용함.
- Event Loop에는 작업을 담아놓는 스택은 존재하지 않음. 여러 개의 큐로 작업을 처리한다.
- Event Loop는 Timer, pending I/O callbacks, idle, prepare, poll, check, close callbacks 페이즈들로 구성되어있고, 이들은 각각의 큐를 가지고 있다.
- Timer phase: setTimeout이나 setTimeInterval과 같은 타이머의 콜백을 저장함. 비로 타이머의 콜백이 큐에 들어가는 것이 아닌 타이머들을 \*min-heap으로 유지하고 있다가, 실행할 때가 된 타이머의 콜백을 큐에 넣고 실행함.
- pending I/O callbacks phase: 이벤트루프의 pending queue에 들어와있는 콜백을 실행함. 이 큐의 콜백은 현재 돌고있는 루프 이전 작업에서 이미 들어와있었음. 예를 들어 TCP 핸들러 콜백 함수에서 파일 쓰기 작업을 했다면, TCP 통신이 끝나고 파일 쓰기도 끝난 후 파일쓰기의 콜백이 pending queue에 들어오게 됨. 또한 에러핸들러의 콜백도 pending queue로 들어옴.
- idle, prepare phase: idle은 매 tick마다, prepare은 매 polling마다 실행된다. Event Loop와 직접적인 관련은 없음.
- poll phase: 새로운 수신 커넥션과 데이터를 허용함. poll phase에 큐(watch queue)가 비어있지않으면 큐가 빌 때까지 동기적으로 모든 콜백을 실행함. 큐가 비어있다면 곧바로 다음 phase로 넘어가지않고 약간의 대기시간을 가짐.
- check phase: setImmediate 콜백 전용 phase
- close phase: close 타입의 핸들러를 처리하는 phase

### Event Loop 작업흐름

- `node example_script.js` 실행 시

1. Node.js는 이벤트 루프 생성 후 이벤트 루프 바깥에서 메인 모듈인 example_script.js을 실행한다.
2. 한 번 메인 모듈이 실행되고나면 Node.js는 이벤트루프가 활성상태인지 확인한다. (이벤트 루프에서 해야할 작업이 있는지 확인)
3. 이벤트 루프에 작업이 없다면 `process.on('exit, () => {})` 을 실행하여 이벤트 루프를 종료한다.
4. 이벤트 루프에 작업이 있다면 첫번째 Timer 페이즈를 실행한다.
5. Timer 페이즈에서 실행할 콜백을 찾음. (오름차순으로 저장되어있음. 제일 먼저 저장되어있는 콜백부터 검사하여 `now - registerdTIme === delta` 의 조건 검사, delta는 `setTimeout(() => {}, 10)`에서의 10). 조건에 맞는 콜백이 있을 때 실행 후 다음 타이머를 검사하는데, 조건에 해당하지않는 타이머를 만나면 즉시 탐색을 종료하고 다음 페이즈로 넘어간다. (각 페이즈는 시스템의 실행한도에 영향을 받기때문에 조건에 부합하여 실행되어야하는 타이머가 있다고해도 한도에 도달하게되면 다음 페이즈로 넘어가게됨.)
6. 타임페이즈가 종료되고난 후 Pending I/O 페이즈에 진입함. 먼저, 이전 실행에서 pending queue에 들어와있는 콜백이 있는지 확인하여 실행함.
7. Pending I/O 페이즈가 종료되면 내부처리를 위한 Idle 페이즈와 Prepare 페이즈를 거친다.
8. Poll 페이즈에 진입 시 watcher queue에 파일 읽기의 응답 콜백이나 HTTP 응답 콜백과 같이 실행할 콜백이 있는지 확인하여 실행함. 만약 더 이상 콜백을 실행할 수 없게 되면(시스템 실행한도에 도달) 이후 남은 페이즈에 잔여 작업이 있는 지 확인함. 잔여 작업이 있다면 다음 페이즈로 이동, 이후 잔여 작업이 없다면 대기하게됨. 이때 대기시간은 타이머 힙의 첫번째 타이머를 검사하여 그 타이머의 딜레이 시간만큼 대기함.
9. Check 페이즈에 진입 시 `setImmediate()`관련 콜백을 실행함.
10. Close 페이즈 진입 시 close, destory 관련 콜백을 실행 함.
11. Close 페이즈 종료 시 더 수행해야할 작업이 있는 지 체크 후 다음 루프를 순회할 지 결정함. (잔여 작업 존재 시 Timer 페이즈부터 다시 순회)

- 아래 코드 스니펫 (1) 실행 시

```
fs.readFile('my-file-path.txt', () => {
  setTimeout(() => {
    console.log('setTimeout');
  }, 0);
  setImmediate(() => {
    console.log('setImmediate');
  });
});
```

1. `fs.readFile()`을 만나면 이벤트루프는 libuv에게 해당 작업을 던짐.
2. 파일읽기는 OS커널에서 비동기 API를 제공하지않기때문에 libuv는 별도의 스레드에 해당 작업을 던짐.
3. 작업이 완료되면 이벤트루프는 `Pending I/O callback phase`의 `pendingqueue`에 해당 작업의 콜백을 등록함.
4. 이벤트루프가 `Pending I/O callback phase`진입하여 콜백 실행
5. `setTimeout`이 `Timer phase`큐에 등록됨.
6. `setImmediate`이 `Check phase`의 `Check queue`에 등록됨.
7. `Poll phase`에는 작업이 없으므로 `Check phase`로 진입하여 'setImmediate' 콘솔 출력.
8. `Timer phase`에 잔여 작업이 있으므로 이벤트루프가 다시 순회함.
9. `Timer phase`에서 타이머를 검사, 딜레이가 0이므로 `setTimeout`의 콜백 즉시 실행함.
10. 'setImmediate' 콘솔 출력.

- 아래 코드 스니펫 (2) 실행 시

```
var i = 0;

function foo () {
  i++;
  if (i > 5) {
    return;
  }

  console.log(foo', i);

  setTimeout(() => {
    console.log('setTimeout', i);
  }, 0);

  process.nextTick(foo);
}

setTimeout(foo, 2);

setTimeout(() => {
  console.log("Other setTimeout");
}, 2);
```

- 실행결과

```
foo 1
foo 2
foo 3
foo 4
foo 5
Other setTimeout
setTimeout 6
setTimeout 6
setTimeout 6
setTimeout 6
setTimeout 6
```

- 두개의 `setTimeout`의 딜레이가 2로 동일하므로 Timer phase에서는 그룹화되어 등록됨.
- 일단 큐에 들어가있으면 시스템 실행한도에 제한이 생기지않는 이상 해당 페이즈가 끝나기 전에 모두 실행됨.
- 따라서 `process.nextTick(foo)`의 `nextTickQueue`에서 재귀실행으로 `nextTickQueue`의 모든 콜백들을 실행하고,
- 동일한 그룹의 타이머로 힙에 있는 두번 째 `setTimeout`의 콜백이 실행됨.
- 그 이후 Timer phase에서 `setTimeout`의 콜백을 처리함.

### libuv

- Node.js에서 사용하는 비동기 I/O 라이브러리
- 윈도우나 리눅스의 커널을 추상화하여 래핑한 구조
- 즉 커널에서 지원하는 비동기 작업들을 알고있기 때문에 커널을 사용할 수 있는 작업을 발견하면 바로 커널로 넘김. 이후 이 작업들이 종료되어 커널로부터 시스템콜을 받으면 이벤트 루프에 콜백을 등록함.
- 커널이 지원하지 않는 작업일 경우 별도의 스레드에서 처리함.

### Thread-Pool

- Node.js는 비동기 명령을 관리하는 별도의 스레드풀을 가지고있지않음. 이것은 Libuv에 포함된 기능임.
- 기본값으로 4개의 스레드를 사용하고, 최대 128개까지 사용가능함.

### nextTickQueue & microTaskQueue

- nextTickQueue는 `process.nextTick()`의 콜백을 가지고있음.
- microTaskQueue는 resolve된 프라미스의 콜백을 가지고있음.
- 이 두개의 큐는 이벤트루프의 일부가 아니다. 즉, libuv 라이브러리에 포함된 것이 아니라 node.js의 기술임.
- 이 두개의 큐는 어떤 페이즈에서 다음 페이즈로 넘어가기 전 자신이 가지고있는 콜백을 최대한 빨리 실행시켜야함. (페이즈에서 다른 페이즈로 넘어가는 것을 tick이라고 부름.)
- 이 두개의 큐는 시스템 실행한도의 영향을 받지않기때문에 node.js는 이 큐가 비워질 때까지 콜백들을 실행함.
- nextTickQueue의 우선순위가 microTaskQueue보다 더 높다.

#### 각주

- min-heap: 상위레벨 노드가 하위레벨 노드보다 작거나 같은 구조로 타이머가 실행되어야하는 순서대로 저장하기 좋은 자료구조

[참고자료] https://www.nextree.co.kr/p7292/
[참고자료] https://evan-moon.github.io/2019/08/01/nodejs-event-loop-workflow/
