function responseNumber(address) { // getting categories should not be used with this function
  try {
    return new Promise(async function(resolve, reject) {
      
      await fetch(address).then(async response => {
      let convertedResponse = await response.json();

      switch (convertedResponse.response_code) {
        case 0: // Success
          resolve(convertedResponse);
          break

        case 1: // No result
          console.log("Nothing was found");
          reject;
          break;
        
        case 2: // Invalid paramater
          console.log("Invalid paramater");
          reject;
          break;
        
        case 3: // Token not found
          console.log("Token not found");
          reject;
          break;

        case 4: // Token empty
          console.log("Token empty");
          reject;
          break;

        case 5: // Rate limit
          console.log("Rate limit reached");
          console.log("reattempting request, please wait a couple of seconds")

          setTimeout(async () => {
            let reattemptResponse = await fetch(address);
            let reattemptConvertedResponse = await reattemptResponse.json();
            if (reattemptConvertedResponse.response_code === 0) {
                console.log("reattempt success");
                resolve(reattemptConvertedResponse);
              } else {
                console.log("something went wrong")
                reject
              }
            }, 6000);
          break;

        default:
          console.log("something with the request went wrong");
          reject;
          break;
        };
      });
    });
  } catch (error) {
      console.log(error)
    }
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
  amountOfQuestions = 10,
  category,
  questionsDifficulty,
  answerType = "multiple",
  token,
) {
  return new Promise(async function(resolve, reject) {
    
  
  try {
    if (
      (typeof amountOfQuestions === "number" || "null" || "undefined") &&
      (typeof category === "number" || "null" || "undefined") &&
      (typeof questionsDifficulty === "string" || "null" || "undefined") &&
      (typeof answerType === "string" || "null" || "undefined")
    ) {

      const settings = new URLSearchParams({
        amount: amountOfQuestions,
        category: category ?? '',
        difficulty: questionsDifficulty ?? '',
        type: answerType,
        encode: 'base64',
        token: token ?? '',
      });

      await responseNumber(`https://opentdb.com/api.php?${settings.toString()}`).then( async questions=>{

        let decodedQuestions = questions.results.map((object) => {
          return {
            type: atob(object.type),
            difficulty: atob(object.difficulty),
            category: atob(object.category),
            question: atob(object.question),
            correct_answer: atob(object.correct_answer),
            incorrect_answers: object.incorrect_answers.map(atob)
          }
        })
          
          resolve(decodedQuestions);
        })

      } else {
        throw new Error("Wrong type sent");
      };
    
  } catch (error) {
    console.log(error);
  };
  })
};

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
