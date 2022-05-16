function solution10(s: string) {
  const wordList = [
    "zero",
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
  ];

  let answer = s;

  for (let i = 0; i < wordList.length; i++) {
    answer = answer.split(wordList[i]).join(String(i));
  }

  return Number(answer);
}
