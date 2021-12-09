$(async function () {
    const $button = $("#submit");
    const $tDiv = $("#table-container");
    const $qDiv = $("#question");
    const $score = $("#score");
    var jsonData;
    var currAns;
    var currScore;
  
    const QUESTION_COUNT = 5;
    const CATEGORY_COUNT = 5;
    
    async function fillTable() {
      let $tHead = $("<thead>");
      let $tBody = $("<tbody>");
      let $table = $("<table>")
        .prepend($tHead)
        .append($tBody);
  
      for (let j = 0; j < QUESTION_COUNT; j++) {
        let $tRow = $("<tr>");
        for (let i = 0; i < CATEGORY_COUNT; i++) {
          let dollars = [100, 200, 400, 600, 800];
          let $qMark = $("<i>")
            .text("$" + dollars[j])
          let $tCell = $("<td>")
            .attr("id", `${i}-${j}`)
            .append($qMark);
          $tRow.append($tCell);
        }
        $tBody.append($tRow);
      }
  
      $tDiv.append($table);
  
    }
  
  
    function showQuestionOrAnswer(id) {
      let $clickedCell = $(`#${id}`);
      // console.log("cell text: " + );
      const text = $clickedCell.text();
      const filteredData = jsonData.filter(e => e.value == text);
  
      let idx = parseInt(Math.random() * filteredData.length % filteredData.length);
      console.log(idx);
      const question = filteredData[idx];
      console.log(question);
      currAns = question.answer;
      currScore = parseInt(text.split('$')[1]);
      $qDiv.empty();
      let $h3 = $("<h2>").text(question.question);
  
      $qDiv.append($h3);
  
  
    }
  
    function showLoadingView() {
      $tDiv.empty();
      let $loading = $("<i>")
        .attr("class", "fas fa-spinner fa-pulse loader");
      $tDiv.append($loading);
    }
  
    function hideLoadingView() {
      $tDiv.empty();
    }
  
    async function fetchJeopardyJson() {
  
      await fetch('https://raw.githubusercontent.com/ci-wdi-900/jquery-jeopardy/master/jeopardy.json')
        .then(response => response.json())
        .then(data => {
          jsonData = data;
          console.log("Data fetched!");
        });
    }
    async function loadScore() {
      const score = localStorage.getItem("score");
      if (score) {
        $score.text("Your Score: $" + score);
      }
    }
    async function setScore(score) {
      // console.log('inside');
      let _score = parseInt(localStorage.getItem("score"));
      if (_score) {
        _score += score;
      } else {
        _score = score;
      }
      localStorage.setItem("score", _score);
      $score.text("Your Score: $" + _score);
    }
  
    async function setupAndStart() {
      showLoadingView(); 
      loadScore();
      await fetchJeopardyJson();
      hideLoadingView(); 
      fillTable(); 
      addListeners();
    }
  
    $button.on("click", async () => {
      const $ans = $("#ans");
      console.log($ans.val());
      console.log(currAns);
      if ($ans.val() == currAns) {
        $qDiv.empty();
        let $h3 = $("<h2>").text("Congrats!");
  
        $qDiv.append($h3);
        setScore(currScore);
      } else {
        $qDiv.empty();
        let $h3 = $("<h2>").text("Incorrect. Correct Answer was: " + currAns);
  
        $qDiv.append($h3);
      }
    });
  
    async function addListeners() {
      const $gameTable = $("table");
      $gameTable.on("click", "td", (evt) => {
        showQuestionOrAnswer(evt.target.id);
      });
    }
    setupAndStart();
  });