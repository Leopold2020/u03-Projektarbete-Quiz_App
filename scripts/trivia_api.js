// async function responseNumber(address) { // Not yet implamanted
//   await fetch(address).then(async response => {
//     let convertedResponse = await response.json();
//     console.log(convertedResponse)

//   switch (convertedResponse.response_code) {
//     case 0: // Success
//       console.log("success");
//       return convertedResponse;

//     case 1: // No result
//       console.log("Nothing was found");
//       break;
    
//     case 2: // Invalid paramater
//       console.log("Invalid paramater");
//       break;
    
//     case 3: // Token not found
//       console.log("Token not found");
//       break;

//     case 4: // Token empty
//       console.log("Token empty");
//       break;

//     case 5: // Rate limit
//       console.log("Rate limit reached");
//       // setTimeout(() => window.location.reload(), 6000);
//       let attempts = 0;
//       while (true) {
//         setTimeout(6000);
//         let reattemptResponse = await fetch(address);
//         let reattemptConvertedResponse = await reattemptResponse.json();

//         if (reattemptConvertedResponse.response_code === 0) {
//           console.log("?")
//           return reattemptConvertedResponse;
//         } if (attempts === 3) {
//           break;
//         } else {
//           attempts += 1;   
//         };
//       };
//       break;

//     default:
//       console.log("no")
//       break;
//     };
//   })
// };


function responseNumber(address) {
  return new Promise(async function(resolve, reject) {
    await fetch(address).then(async response => {
    let convertedResponse = await response.json();

    switch (convertedResponse.response_code) {
      case 0: // Success
        console.log("success");
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
        // setTimeout(() => window.location.reload(), 6000);
        // let attempts = 0;
        console.log("reattempting")
        
        
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
          
          // Work in progress, will try to get below to work
          
          // const reattempt = async () => {
          //     let reattemptResponse = await fetch(address);
          //     let reattemptConvertedResponse = await reattemptResponse.json();
  
          //     if (reattemptConvertedResponse.response_code === 0) {
          //       console.log("reattempt success");
          //       resolve(reattemptConvertedResponse);
          //     }
          // }
          
          // while (true) {

          //   console.log("attempt: ", attempts)
            
          //   let reattemptResponse = await fetch(address);
          //   let reattemptConvertedResponse = await reattemptResponse.json();

          //   if (reattemptConvertedResponse.response_code === 0) {
          //     console.log("reattempt success");
          //     resolve(reattemptConvertedResponse);
          //   } if (attempts === 3) {
          //     console.log("test")
          //     reject;
          //   } else {
          //     attempts ++;
          //   };
          // };
        break;

      default:
        console.log("no");
        reject;
        break;
      };
    });
  });
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

// export async function getQuestions(
//   amountOfQuestions,
//   category,
//   questionsDifficulty,
//   answerType,
//   token
// ) {
//   try {
//     if (
//       (typeof amountOfQuestions === "number" || "null" || "undefined") &&
//       (typeof category === "number" || "null" || "undefined") &&
//       (typeof questionsDifficulty === "string" || "null" || "undefined") &&
//       (typeof answerType === "string" || "null" || "undefined")
//     ) {
//       const toSend = (
//         `https://opentdb.com/api.php?amount=${amountOfQuestions ?? `10`}` +
//         (category ? '&category=' + category : '') +
//         (questionsDifficulty ? '&difficulty=' + questionsDifficulty : '') +
//         (answerType ? '&type=' + answerType : '&type=multiple') +
//         '&encode=base64' +
//         (token ? '&token=' + token : '')
//       );
//       console.log(toSend);
//       await responseNumber(toSend).then( async questions=>{
        
//         console.log("!")
//         console.log(questions)

        
//         if (!questions.response_code === 0) {
//           throw new Error("Response did not succeed");
//         } else {
//           // const processedQuestions = await questions.json();
          
//           let decodedQuestions = questions.results.map((object) => {
//             return {
//               type: atob(object.type),
//               difficulty: atob(object.difficulty),
//               category: atob(object.category),
//               question: atob(object.question),
//               correct_answer: atob(object.correct_answer),
//               incorrect_answers: object.incorrect_answers.map(atob)
//             }
//           })
          
//           return decodedQuestions;
//         }
//         })

//       } else {
//         throw new Error("Wrong type sent");
//       };
    
//   } catch (error) {
//     console.log(error);
//   };
// };

export async function getQuestions(
  amountOfQuestions,
  category,
  questionsDifficulty,
  answerType,
  token
) {
  return new Promise(async function(resolve, reject) {
    
  
  try {
    if (
      (typeof amountOfQuestions === "number" || "null" || "undefined") &&
      (typeof category === "number" || "null" || "undefined") &&
      (typeof questionsDifficulty === "string" || "null" || "undefined") &&
      (typeof answerType === "string" || "null" || "undefined")
    ) {
      const toSend = (
        `https://opentdb.com/api.php?amount=${amountOfQuestions ?? `10`}` +
        (category ? '&category=' + category : '') +
        (questionsDifficulty ? '&difficulty=' + questionsDifficulty : '') +
        (answerType ? '&type=' + answerType : '&type=multiple') +
        '&encode=base64' +
        (token ? '&token=' + token : '')
      );
      console.log(toSend);
      await responseNumber(toSend).then( async questions=>{
        
        console.log("!")
        console.log(questions)

        
        if (!questions.response_code === 0) {
          throw new Error("Response did not succeed");
        } else {
          // const processedQuestions = await questions.json();
          
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
        }
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
