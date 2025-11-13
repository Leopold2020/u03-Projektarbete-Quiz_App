function responseNumber(response) { // Not yet implamanted
  switch (response.response_code) {
    case 0: // Success
      break;

    case 1: // No result
      console.log("Nothing was found")
      break;
    
    case 2: // Invalid paramater
      console.log("Invalid paramater")
      break;
    
    case 3: // Token not found
      console.log("Token not found")
      break;

    case 4: // Token empty
      console.log("Token empty")
      break;

    case 5: // Rate limit
      console.log("Rate limit reached")
      break;
    
    default:
      break;
  };
};

export async function getToken(existingToken) {
  try {
    if (existingToken != null && existingToken.length > 0) {
      const uppdateToken = await fetch(
        `https://opentdb.com/api_token.php?command=reset&token=${existingToken}`
      );
    } else {
      const newToken = await fetch(
        "https://opentdb.com/api_token.php?command=request"
      );
      if (!newToken.ok) {
        throw new Error("Response did not succeed");
      } else {
        const processedToken = await newToken.json();
        return processedToken.token;
      }
    }
  } catch (error) {
    console.log(error);
  }
}

export async function getCategories() {
  try {
    const categories = await fetch("https://opentdb.com/api_category.php");

    if (!categories.ok) {
      throw new Error("Response did not succeed");
    } else {
      const processedCategories = await categories.json();
      return processedCategories.trivia_categories;
    }
  } catch (error) {
    console.log(error);
  }
}

export async function getQuestions(
  amountOfQuestions,
  category,
  questionsDifficulty,
  answerType,
  token
) {
  try {
    if (
      (typeof amountOfQuestions === "number" || "null" || "undefined") &&
      (typeof category === "number" || "null" || "undefined") &&
      (typeof questionsDifficulty === "string" || "null" || "undefined") &&
      (typeof answerType === "string" || "null" || "undefined")
    ) {
      const questions = await fetch(
        `https://opentdb.com/api.php?amount=${amountOfQuestions ?? `10`}` +
          (category ? `&category=` + category : ``) +
          (questionsDifficulty ? `&difficulty=` + questionsDifficulty : ``) +
          (answerType ? `&type=` + answerType : ``) +
          (token ? `&token=` + token : ``)
      );

      if (!questions.ok) {
        throw new Error("Response did not succeed");
      } else {
        const processedQuestions = await questions.json();
        return processedQuestions.results;
      }
    } else {
      throw new Error("Wrong type sent");
    }
  } catch (error) {
    console.log(error);
  }
}

// Example for calling functions

// getCategories().then(res => {
//     console.log(res)
// });

// getQuestions().then(res => {
//     console.log(res)
// });

// getToken().then(res => {
//     console.log(res)
// });
