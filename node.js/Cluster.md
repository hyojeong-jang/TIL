# Cluster

##### Node.js Clustering 이해하기

### Computer Cluster 정의

- 여러 개의 컴퓨터들이 연결되어 하나의 시스템처럼 동작하는 컴퓨터들의 집합을 말한다.
- 일반적으로 단일 컴퓨터보다 뛰어난 성능과 안정성을 제공한다.
- 비슷한 성능과 안정성을 제공하는 단일 컴퓨터보다 비용 측면에서 더 효율적이다.

### Node.js Cluster

- Node.js는 기본적으로 하나의 프로세스가 32Bit에서는 512MB의 매모리, 64Bit에서는 1.5GB의 메모리를 사용할 수 있도록 제한되어 있음.
- CPU 코어를 모두 사용할 수 있게 해주는 모듈
- 포트를 공유하는 노드 프로세스를 여러 개 둘 수 있음.
- worker를 늘려 병렬로 동작하게 하면 요청이 분산되어 효율을 극대화할 수 있음.
- 예를 들어 코어가 8개인 서버가 있을 경우 노드는 기본적으로 하나의 코어만 활용한다, 그러나 clustering을 통해 코어 하나 당 노트 프로세스 하나가 돌아가게 할 수 있음.
- 메모리를 공유하지 못한다는 단점이 있음.

[참고자료] https://programmingsummaries.tistory.com/384
[참고자료] https://lgphone.tistory.com/67