//Call The all Element From "index.html" Page.
var addQuestion = document.getElementById("submitBtn");
var questionSubject = document.getElementById("subject");
var questionDescription = document.getElementById("question");
var allQuestionsList = document.getElementById("dataList");
var createQuestionForm = document.getElementById("toggleDisplay");
var FullQuestionContainer = document.getElementById("respondQue");
var resolveQuestionCOntainer = document.getElementById("resolveHolder");
var resolveQuestions = document.getElementById("resolveQuestion");
var responseContainer = document.getElementById("respondAns");
var commentContainerNode = document.getElementById("commentHolder");
var commentatorName = document.getElementById("pickName");
var commentNode = document.getElementById("pickComment");
var submitCommentNode = document.getElementById("commentBtn");
var questionSearch = document.getElementById("questionSearch");
var upvote = document.getElementById("upvote");
var downvote = document.getElementById("downvote");



/*
*   On Day 2
* 1. Resolve or delete the question.
* 2. Upvote.
* 3. DownVote.
* 4. Search the question.

*/ 


//After Searching ShowResult.
questionSearch.addEventListener("change", function (event) 
{
  filterResult(event.target.value);
})

//Filter Searching Result.
function filterResult(query) {

  var allQuestions = getAllQuestions();

  if (query) {
    clearQuestionPanel();

    var filteredQuestions = allQuestions.filter(function (question) {
      if (question.title.includes(query)) {
        return true;
      }
    });

    if (filteredQuestions.length) {
      filteredQuestions.forEach(function (question) {
        addQuestionToPanel(question);
      })
    }
    else {
      printNoMatchFound();
    }
  }
  else {
    clearQuestionPanel();

    allQuestions.forEach(function (question) {

      addQuestionToPanel(question);

    });
  }
}

//Clear All Questions
function clearQuestionPanel() {
  allQuestionsList.innerHTML = "";
  FullQuestionContainer.style.display="none";
  commentContainerNode.style.display="none";
  createQuestionForm.style.display="";
  resolveQuestionCOntainer.style.display="none";
  responseContainer.style.display="none";
}


//OnLoad Function Show All Exicting Question.
function onLoad() 
{
  var allQuestions = getAllQuestions();
  allQuestions = sortallQuestionOnUpvotes(allQuestions);
  allQuestions.forEach(function (question) {
    addQuestionToPanel(question)
  })
}


//Sort The Question According To Upvotes.
function sortallQuestionOnUpvotes(allQuestions)
{
  return allQuestions.sort((a,b) =>{
    return b.upvotes - a.upvotes
  })
}

//Call The OnLoad Function.
onLoad();

//Listener For Add Question In LeftPanel.
addQuestion.addEventListener("click", onQuestionSubmit);

//After Submit The Question Form.
function onQuestionSubmit() {
  var question = {
    title: questionSubject.value,
    description: questionDescription.value,
    responses: [],
    upvotes: 0,
    downvotes: 0,
    createdAt: Date.now()
  }
  //This Condtiion is True Then Continue Further Process.
 if(  questionSubject.value != "" && questionDescription.value ){
  saveQuestion(question);
  addQuestionToPanel(question);
  clearQuestionForm();
 }
}

//After Submit The Question Form Question Save In LocalStorage. 
function saveQuestion(question) 
{
  
  var allQuestions = getAllQuestions();

  allQuestions.push(question);

  localStorage.setItem("questions", JSON.stringify(allQuestions));
}

//Recieve All Question From LoaclStorage.
function getAllQuestions() {
  var allQuestions = localStorage.getItem("questions");

  if (allQuestions) 
  {
    allQuestions = JSON.parse(allQuestions)
  }
  else 
  {
    allQuestions = []
  }

  return allQuestions;

}

//Add Question In LeftPanel With All UI LikeAs DownVote,UpVote.
function addQuestionToPanel(question) 
{
  var questionContainer = document.createElement("div");
  questionContainer.setAttribute("id", question.title);
  questionContainer.style.background = "orange";
  questionContainer.style.borderRadius="30px"


  var newquestionSubject = document.createElement("h2");
  newquestionSubject.innerHTML = question.title;
  questionContainer.appendChild(newquestionSubject);
  newquestionSubject.style.marginLeft="30px";

  var newquestionDescription = document.createElement("p");
  newquestionDescription.innerHTML = question.description;
  questionContainer.appendChild(newquestionDescription);
  newquestionDescription.style.color="grey"
  newquestionDescription.style.marginLeft="5px"


  var upvoteTextNode = document.createElement("h4");
  upvoteTextNode.innerHTML = "upvote = " + question.upvotes
  upvoteTextNode.style.color = "green";
  questionContainer.appendChild(upvoteTextNode);
  upvoteTextNode.style.marginLeft="5px";

  var downvoteTextNode = document.createElement("h4");
  downvoteTextNode.innerHTML = "downvote = " + question.downvotes;
  downvoteTextNode.style.color = "red";
  questionContainer.appendChild(downvoteTextNode);
  downvoteTextNode.style.marginLeft="5px";

  var creationDateAndTimeNode = document.createElement("h4");
  creationDateAndTimeNode.innerHTML = new Date(question.createdAt).toLocaleString();
  questionContainer.appendChild(creationDateAndTimeNode);
  creationDateAndTimeNode.style.textAlign="right"
  creationDateAndTimeNode.style.marginRight="40px"
  allQuestionsList.appendChild(questionContainer);

  //Listener For On Question Click.
  questionContainer.addEventListener("click", onQuestionClick(question));

}

//After Submit The Question Clear question Form.
function clearQuestionForm() {
  questionSubject.value = "";
  questionDescription.value = "";
}

// Function For When Click On Question. 
function onQuestionClick(question) {
  return function () {
    //After Click On Question Hide Question From.
    hideQuestionPanel();

    //clear last details
    clearQuestionDetails();
    clearResponsePanel();

    //After Click On Question question show in LeftPan
    showDetails();

    // create question details
    addQuestionToRight(question);

    //Again After click On Question sow All Pervious Response.
    question.responses.forEach(function (response) {
      addResponseInPanel(response)
    })

  
    submitCommentNode.onclick = onResponeSubmit(question);
    upvote.onclick = upvoteQuestion(question);
    downvote.onclick = downvoteQuestion(question);

    resolveQuestions.onclick = resolveQuestion(question);
  }
}

// Function For Like The Question.
function upvoteQuestion(question) {
  return function () {
    question.upvotes++;
    updateQuestion(question);
    updateQuestionUI(question);
  }

}

// Function For Unlike The Question.
function downvoteQuestion(question) {
  return function () {
    question.downvotes++;
    updateQuestion(question);
    updateQuestionUI(question);

  }

}

//Update Question UI
function updateQuestionUI(question) {

  var questionContainerNode = document.getElementById(question.title);

  questionContainerNode.childNodes[2].innerHTML = "upvote = " + question.upvotes;
  questionContainerNode.childNodes[3].innerHTML = "downvote = " + question.downvotes;

}
//Click On Response Submit Button.
function onResponeSubmit(question) {
  return function () {
    var response = {
      name: commentatorName.value,
      description: commentNode.value
    }

    saveResponse(question, response);

    addResponseInPanel(response)
    clearResponseForm();
  }
}

//Show Response After Comment Or Click On Question. 
function addResponseInPanel(response) {
  var responseContainer1 = document.createElement("div");
  
  var userNameNode = document.createElement("h4");
  userNameNode.innerHTML = response.name;

  var userCommentNode = document.createElement("p");
  userCommentNode.innerHTML = response.description;

  responseContainer1.appendChild(userNameNode);
  responseContainer1.appendChild(userCommentNode);

  responseContainer.appendChild(responseContainer1);
}
//After Click On submit Button Clear Question Form.
function clearResponseForm() {
  commentatorName.value = "";
  commentNode.value = "";
}

//After Click On Question Hide QuestionFrom.
function hideQuestionPanel() {
  createQuestionForm.style.display = "none";
}


//Show QuestionDetails
function showDetails() {
  FullQuestionContainer.style.display = "block";
  resolveQuestionCOntainer.style.display = "block";
  responseContainer.style.display = "block";
  commentContainerNode.style.display = "block";
}

//Question Show In RightPanel After Click On Question.
function addQuestionToRight(question) {
  var titleNode = document.createElement("h3");
  titleNode.innerHTML = question.title;

  var descriptionNode = document.createElement("p")
  descriptionNode.innerHTML = question.description;

  var createdDate = document.createElement("h4");
  createdDate.innerHTML = new Date(question.createdAt).toLocaleString();


  FullQuestionContainer.appendChild(titleNode);
  FullQuestionContainer.appendChild(descriptionNode);
  FullQuestionContainer.appendChild(createdDate);

}

//update question
function updateQuestion(updatedQuestion) {
  var allQuestions = getAllQuestions();

  var revisedQuestions = allQuestions.map(function (question) {
    if (updatedQuestion.title === question.title) {
      return updatedQuestion
    }

    return question;
  })

  localStorage.setItem("questions", JSON.stringify(revisedQuestions));
}


//Save Comment  In LocalStorage After Click Submit Button.
function saveResponse(updatedQuestion, response) {
  var allQuestions = getAllQuestions();

  var revisedQuestions = allQuestions.map(function (question) {
    if (updatedQuestion.title === question.title) {
      question.responses.push(response)
    }

    return question;
  })

  localStorage.setItem("questions", JSON.stringify(revisedQuestions));
}


function clearQuestionDetails() {
  FullQuestionContainer.innerHTML = "";
}
//Clear Response Panel After Comment.
function clearResponsePanel() {
  responseContainer.innerHTML = "";
}

//After Searching Nothing  Match.
function printNoMatchFound() {
  var title = document.createElement("h1");
  title.innerHTML = "No match found";

  allQuestionsList.appendChild(title)
}

//Delete Selected Question From Pnael or Localstorage. 
function resolveQuestion(question) {
  return function () {
    var allQuestions = getAllQuestions();
    var len = allQuestions.length;
    var ind;
    allQuestions.forEach(function (arrayItem) {
      if (arrayItem.title == question.title) {
        var ind = allQuestions.indexOf(arrayItem);
        console.log(ind);
        allQuestions.splice(ind, 1);
      }
    });
    localStorage.setItem("questions", JSON.stringify(allQuestions));
    clearQuestionPanel();
    onLoad();
  }
}

