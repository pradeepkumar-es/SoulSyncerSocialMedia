/* === Imports === */
// Import the functions you need from the SDKs you need
import { initializeApp } from "./node_modules/@firebase/app"; /* importing initializeApp function from firebase/app to initialize our web app
with firebase wervices */

//for Cloud firestore setup
import {
  getFirestore,
  collection,
  addDoc,
  //for custom id for data collection
  doc,
  setDoc,
  updateDoc,
  serverTimestamp,
  // getDocs, //not need bcz we will update directly it
  onSnapshot,
  query, where, //let only display if needed
  orderBy
} from "./node_modules/@firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

//importing getAuth function for authentication purpose
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from "./node_modules/@firebase/auth";
/* === Firebase Setup === */
// Your web app's Firebase configuration
/*it is firebase configurationn object that has unique identifier and url which allow our web app to correctly connect
with firebase projects*/
const firebaseConfig = {
  apiKey: "AIzaSyCBFaCLtf7Oc1Q2pBhA6dyVAvsjROtR5a4",
  authDomain: "social-media-bcfb2.firebaseapp.com", //domain used for firebase authentication
  projectId: "social-media-bcfb2",
  storageBucket: "social-media-bcfb2.appspot.com", //to store data and get data from storage
  messagingSenderId: "1087184852564",
  appId: "1:1087184852564:web:5f964de0f31d2b33593fc1",
};

// Initialize Firebase //calling our initialized app by passing arguent of our firebase configuration and storing to app //establish connection with firebase
const app = initializeApp(firebaseConfig);
// console.log(app); //FirebaseAppImpl {_isDeleted: false, _options: {…}, _config: {…}, _name: '[DEFAULT]', _automaticDataCollectionEnabled: false, …}
// console.log(typeof(app)) //object

/* Challenge: Console log the projectId by using app.options.projectId */
// console.log(app.options.projectId) //social-media-bcfb2

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app); //this function lets us create the instance of firebase authentication servie to use inside our app
// console.log(auth) //AuthImpl {app: FirebaseAppImpl, heartbeatServiceProvider: Provider, appCheckServiceProvider: Provider, config: {…}, currentUser: null, …}
// console.log(typeof(auth)) //object
/* to use authentication service go to your firebase project >> authentication >> user >> sign in method >> choose one of the and enable it >> save   */

const provider = new GoogleAuthProvider(); //for google sign in //used to use google as means of authentication

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);
console.log(db); //Firestore
console.log(typeof db); //object
/* === UI === */

/* == UI - Elements == */

const viewLoggedOut = document.getElementById("logged-out-view");
const viewLoggedIn = document.getElementById("logged-in-view");

const signInWithGoogleButtonEl = document.getElementById(
  "sign-in-with-google-btn"
);

const emailInputEl = document.getElementById("email-input");
const passwordInputEl = document.getElementById("password-input");

const signInButtonEl = document.getElementById("sign-in-btn");
const createAccountButtonEl = document.getElementById("create-account-btn");
const signOutButtonEl = document.getElementById("sign-out-btn");
const userProfilePictureEl = document.getElementById("user-profile-picture");
const userGreetingEl = document.getElementById("user-greeting");
const displayNameInputEl = document.getElementById("display-name-input");
const photoURLInputEl = document.getElementById("photo-url-input");
const updateProfileButtonEl = document.getElementById("update-profile-btn");
const moodEmojiEls = document.getElementsByClassName("mood-emoji-btn");
const textareaEl = document.getElementById("post-input");
const postButtonEl = document.getElementById("post-btn");
// const fetchPostsButtonEl = document.getElementById("fetch-posts-btn");
const allFilterButtonEl = document.getElementById("all-filter-btn")

const filterButtonEls = document.getElementsByClassName("filter-btn")

const postsEl = document.getElementById("posts");

/* == UI - Event Listeners == */

signInWithGoogleButtonEl.addEventListener("click", authSignInWithGoogle);

signInButtonEl.addEventListener("click", authSignInWithEmail);
createAccountButtonEl.addEventListener("click", authCreateAccountWithEmail);
signOutButtonEl.addEventListener("click", authSignOut);
updateProfileButtonEl.addEventListener("click", authUpdateProfile);
for (let moodEmojiEl of moodEmojiEls) {
  moodEmojiEl.addEventListener("click", selectMood);
}
for (let filterButtonEl of filterButtonEls) {
  filterButtonEl.addEventListener("click", selectFilter)
}
postButtonEl.addEventListener("click", postButtonPressed);
// fetchPostsButtonEl.addEventListener("click", fetchOnceAndRenderPostsFromDB);
/* === State === */
let moodState = 0;

/* === Global Constants === */

const collectionName = "posts"

/* === Main Code === */

// showLoggedInView();
/*  Challenge:
    Import the onAuthStateChanged function from 'firebase/auth'

	Use the code from the documentaion to make this work.
    https://firebase.google.com/docs/auth/web/start#set_an_authentication_state_observer_and_get_user_data
    
    Use onAuthStateChanged to:
    
    Show the logged in view when the user is logged in using showLoggedInView()
    
    Show the logged out view when the user is logged out using showLoggedOutView()
*/
onAuthStateChanged(auth, (user) => {
  //here user is an object
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/auth.user
    showLoggedInView(); /* now we don't need to run this function in the function
                        of create account/sign in /sign out if user create account/sign in/sign out
                        remove this function */
    showProfilePicture(userProfilePictureEl, user);
    showUserGreeting(userGreetingEl, user);
    // fetchInRealtimeAndRenderPostsFromDB(user)
    updateFilterButtonStyle(allFilterButtonEl)
    fetchAllPosts(user)
  } else {
    // User is signed out
    showLoggedOutView(); /* now we don't need to run this function in the function
    of create account/sign in /sign out if user create account/sign in/sign out
    remove this function */
  }
});

/* === Functions === */

/* = Functions - Firebase - Authentication = */

function authSignInWithGoogle() {
  /* go to firebase console>>select project >> build >> authentication >> sign in method >>add new provider >> Google >>enable>>
  >>select support email for your project>>save */
  /*  Challenge:
		Import the signInWithPopup function from 'firebase/auth'

        Use the code from the documentaion to make this function work.
        https://firebase.google.com/docs/auth/web/google-signin#handle_the_sign-in_flow_with_the_firebase_sdk
       
        If the login is successful then you should console log "Signed in with Google"
        If something went wrong, then you should log the error message using console.error.
    */
  /* If you want that any user can also login through other logined account (other than gmail) on their system to this website 
   then under authentication >> go to setting >> authorized domain >> add domain >> like microsoft.com, etc.*/
  signInWithPopup(auth, provider)
    .then((result) => {
      console.log("Signed with google");
    })
    .catch((error) => {
      console.error(error.message);
    });
}

function authSignInWithEmail() {
  //   console.log("Sign in with email and password");
  /*  Challenge:
		Import the signInWithEmailAndPassword function from 'firebase/auth'

        Use the code from the documentaion to make this function work.
        https://firebase.google.com/docs/auth/web/start#sign_in_existing_users
        
        Make sure to first create two consts, 'email' and 'password', to fetch the values from the input fields emailInputEl and passwordInputEl.
       
        If the login is successful then you should show the logged in view using showLoggedInView()
        If something went wrong, then you should log the error message using console.error.
    */
  const email = emailInputEl.value;
  const password = passwordInputEl.value;
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      clearAuthFields(); //clear filled data on interface after creation of user
      //   showLoggedInView();  //it is handled by onAuthStateChanged function
    })
    .catch((error) => {
      console.error(error.message);
    });
}

function authCreateAccountWithEmail() {
  //   console.log("Sign up with email and password");
  /*  Challenge:
		Import the createUserWithEmailAndPassword function from 'firebase/auth'

        Use the code from the documentaion to make this function work.
        https://firebase.google.com/docs/auth/web/start#sign_up_new_users
        
        Make sure to first create two consts, 'email' and 'password', to fetch the values from the input fields emailInputEl and passwordInputEl.
       
        If the creation of user is successful then you should show the logged in view using showLoggedInView()
        If something went wrong, then you should log the error message using console.error.
        ** for email verification purpose , if you want to add 
        https://firebase.google.com/docs/auth/web/manage-users#send_a_user_a_verification_email
    */
  const email = emailInputEl.value; //email input value
  const password = passwordInputEl.value; //password input value
  createUserWithEmailAndPassword(auth, email, password) //it return a promises
    .then((userCredential) => {
      /* if everything goes well then this fucntion will run */
      clearAuthFields(); //clear filled data on interface after creation of user
      //   showLoggedInView(); //it is handled by onAuthStateChanged function
    })
    .catch((error) => {
      /* something gone wrong while creating account then this function will run */
      console.error(error.message);
    });
}

function authSignOut() {
  //   console.log("Signed out");
  /*  Challenge:
		Import the signOut function from 'firebase/auth'

        Use the code from the documentaion to make this function work.
        https://firebase.google.com/docs/auth/web/password-auth#next_steps
       
        If the log out is successful then you should show the logged out view using showLoggedOutView()
        If something went wrong, then you should log the error message using console.error.
    */
  signOut(auth)
    .then(() => {
      //   showLoggedOutView(); //it is handled by onAuthStateChanged function
    })
    .catch((error) => {
      console.error(error.message);
    });
}

// async function fetchOnceAndRenderPostsFromDB() {
//   /*  Challenge:
//   Import collection and getDocs from 'firebase/firestore'

//       Use the code from the documentaion to make this function work.
//       https://firebase.google.com/docs/firestore/query-data/get-data#get_all_documents_in_a_collection
      
//       This function should fetch all posts from the 'posts' collection from firestore and then console log each post in this way:
//       "{Document ID}: {Post Body}"
//   */
//   const querySnapshot = await getDocs(collection(db, "posts"));
//   clearAll(postsEl) //to clear all post before rendring to avoid multiple display of same post
//   querySnapshot.forEach((doc) => {
//     // console.log(doc.id, " => ", doc.data()); //all data
//     // console.log(`${doc.id}: ${doc.data().createdAt}`); //only body section
//     renderPost(postsEl, doc.data())
//   });
// }
function fetchInRealtimeAndRenderPostsFromDB(query, user) {
  
      /* Challenge:
          Finish implementing this function.
          https://firebase.google.com/docs/firestore/query-data/listen
          First, clear all the posts in postsEl.
          
          Then, use forEach on querySnapshot to run through each document and use the renderPost function to render each post.
          
          Hint: If you're stuggling feel free to rewind to take a peak at the fetchOnceAndRenderPostsFromDB() function from earlier.
       */

      /* Challenge: 
       Import query and where from 'firebase/firestore'
       
       Use the code from the documentaion to make this function work.
       https://firebase.google.com/docs/firestore/query-data/queries#simple_queries
       
       Create a const called 'q' where you run a query.
       
       The query should fetch only the posts that the currently logged in user has created.
    */
   // Create a query against the collection.

// const q = query(postRef, where("uid", "==", user.uid));

/* Challenge: Change the query to use orderBy to order by date, with the newest posts on top. 
You'll need to import the orderBy function from 'firebase/firestore' first.
for working it correctly make sure enable indexes in cloud firestore by console message link ref https://console.firebase.google.com/project/social-media-bcfb2/firestore/databases/-default-/indexes?create_composite=ClBwcm9qZWN0cy9zb2NpYWwtbWVkaWEtYmNmYjIvZGF0YWJhc2VzLyhkZWZhdWx0KS9jb2xsZWN0aW9uR3JvdXBzL3Bvc3RzL2luZGV4ZXMvXxABGgcKA3VpZBABGg0KCWNyZWF0ZWRBdBACGgwKCF9fbmFtZV9fEAI */
//https://firebase.google.com/docs/firestore/query-data/order-limit-data#order_and_limit_data
// const postRef = collection(db, collectionName)
// const q = query(postRef, where("uid", "==", user.uid), orderBy("createdAt", "desc"));  //desc: descending order
onSnapshot(query, (querySnapshot) => {
          clearAll(postsEl)
        
          querySnapshot.forEach((doc) => {
              renderPost(postsEl, doc.data())
          })
  })
}

function fetchTodayPosts(user) {
  const startOfDay = new Date()
  startOfDay.setHours(0, 0, 0, 0)
  
  const endOfDay = new Date()
  endOfDay.setHours(23, 59, 59, 999)
  
  const postsRef = collection(db, collectionName)
  
  const q = query(postsRef, where("uid", "==", user.uid),
                            where("createdAt", ">=", startOfDay),
                            where("createdAt", "<=", endOfDay),
                            orderBy("createdAt", "desc"))
                            
  fetchInRealtimeAndRenderPostsFromDB(q, user)                  
}

function fetchWeekPosts(user) {
  const startOfWeek = new Date()
  startOfWeek.setHours(0, 0, 0, 0)
  
  if (startOfWeek.getDay() === 0) { // If today is Sunday
      startOfWeek.setDate(startOfWeek.getDate() - 6) // Go to previous Monday
  } else {
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1)
  }
  /*
        Challenge:
        Finish implementing the rest of the function.
        Set the endOfDay.
        Create a postsRef.
        Create a query.
        Call the fetchRealtimeAndRenderPostsFromDB with query and user as arguments.
        
        Hint: Use fetchTodayPosts
     */
        const endOfDay = new Date()
        endOfDay.setHours(23, 59, 59, 999)
        
        const postsRef = collection(db, collectionName)
        
        const q = query(postsRef, where("uid", "==", user.uid),
                                  where("createdAt", ">=", startOfWeek),
                                  where("createdAt", "<=", endOfDay),
                                  orderBy("createdAt", "desc"))
                                  
        fetchInRealtimeAndRenderPostsFromDB(q, user)
}

function fetchMonthPosts(user) {
  const startOfMonth = new Date()
  startOfMonth.setHours(0, 0, 0, 0)
  startOfMonth.setDate(1)

  const endOfDay = new Date()
  endOfDay.setHours(23, 59, 59, 999)

const postsRef = collection(db, collectionName)
  
  const q = query(postsRef, where("uid", "==", user.uid),
                            where("createdAt", ">=", startOfMonth),
                            where("createdAt", "<=", endOfDay),
                            orderBy("createdAt", "desc"))

  fetchInRealtimeAndRenderPostsFromDB(q, user)
}

function fetchAllPosts(user) {
  const postsRef = collection(db, collectionName)
  const q = query(postsRef, where("uid", "==", user.uid),
                            orderBy("createdAt", "desc"))

  fetchInRealtimeAndRenderPostsFromDB(q, user)
}

/* == Functions - UI Functions == */
function renderPost(postsEl, postData) {
  /*  Challenge:
  This function takes in the posts element and post data (doc.data())
      
      Use the example post HTML code from index.html to make this function render a post using innerHTML on postsEl.
      
      Each post should dynamically include the:
      - Post createdAt date (use the displayDate function to convert to correct format)
      - Post mood emoji image
      - Post body
  */

      //inner Html have security issue  //use createElement
  //     postsEl.innerHTML += `
  //     <div class="post">
  //         <div class="header">
  //             <h3>${displayDate(postData.createdAt)}</h3>
  //             <img src="assets/emojis/${postData.mood}.jpeg">
  //         </div>
  //         <p>
          
  //         ${replaceNewlinesWithBrTags(postData.body)}
  //         </p>
  //     </div>
  // `

  
}

function replaceNewlinesWithBrTags(inputString) {
  // Challenge: Use the replace method on inputString to replace newlines with break tags and return the result
  return inputString.replace(/\n/g, "<br>")  //it matches \n globally(g) in whenever new line charcter is created by input
}

function postButtonPressed() {
  const postBody = textareaEl.value;
  const user = auth.currentUser;
  if (postBody && moodState) {
    addPostToDB(postBody, user);
    clearInputField(textareaEl);
    resetAllMoodElements(moodEmojiEls);
  }
}

function showLoggedOutView() {
  hideView(viewLoggedIn);
  showView(viewLoggedOut);
}

function showLoggedInView() {
  hideView(viewLoggedOut);
  showView(viewLoggedIn);
}

function showView(view) {
  view.style.display = "flex";
}

function hideView(view) {
  view.style.display = "none";
}

function clearInputField(field) {
  field.value = "";
}

function clearAuthFields() {
  clearInputField(emailInputEl);
  clearInputField(passwordInputEl);
}
function clearAll(element) {
  element.innerHTML = ""
}
function showProfilePicture(imgElement, user) {
  /*  Challenge:
        Use the documentation to make this function work.
        https://firebase.google.com/docs/auth/web/manage-users#get_a_users_profile
        
        This function has two parameters: imgElement and user
        
        We will call this function inside of onAuthStateChanged when the user is logged in.
        
        The function will be called with the following arguments:
        showProfilePicture(userProfilePictureEl, user)
        
        If the user has a profile picture URL, set the src of imgElement to that URL.
        
        Otherwise, you should set the src of imgElement to "assets/images/default-profile-picture.jpeg"
    */
  /*
        const user = auth.currentUser;
        if (user !== null) {
            // The user object has basic properties such as display name, email, etc.
            const displayName = user.displayName;
            const email = user.email;
            const photoURL = user.photoURL;
            const emailVerified = user.emailVerified;
          
            // The user's ID, unique to the Firebase project. Do NOT use
            // this value to authenticate with your backend server, if
            // you have one. Use User.getToken() instead.
            const uid = user.uid;
          }*/

  const photoURL = user.photoURL;
  if (photoURL) {
    imgElement.src = photoURL;
  } else {
    imgElement.src = "./assets/images/user-icon.png";
  }
}

function showUserGreeting(element, user) {
  /*  Challenge:
        Use the documentation to make this function work.
        https://firebase.google.com/docs/auth/web/manage-users#get_a_users_profile
        
        This function has two parameters: element and user
        
        We will call this function inside of onAuthStateChanged when the user is logged in.
        
        The function will be called with the following arguments:
        showUserGreeting(userGreetingEl, user)
        
        If the user has a display name, then set the textContent of element to:
        "Hey John, how are you?"
        Where John is replaced with the actual first name of the user
        
        Otherwise, set the textContent of element to:
        "Hey friend, how are you?" 
    */
  const displayName = user.displayName;
  if (displayName) {
    const userFirstName = displayName.split(" ")[0];
    element.textContent = `Hey ${userFirstName}, how are you?`;
  } else {
    element.textContent = "Hey friend, how are you?";
  }
}

function authUpdateProfile() {
  /*  Challenge:
        Import the updateProfile function from 'firebase/auth'
    
        Use the documentation to make this function work.
        https://firebase.google.com/docs/auth/web/manage-users#get_a_users_profile
        
        Make sure to first create two consts, 'newDisplayName' and 'newPhotoURL', to fetch the values from the input fields displayNameInputEl and photoURLInputEl.
        
        If the updating of profile is successful then you should console log "Profile updated".
        If something went wrong, then you should log the error message using console.error
        
        Resources:
        Justin Bieber profile picture URL: https://i.imgur.com/6GYlSed.jpg
    */
  const newDisplayName = displayNameInputEl.value;
  const newPhotoURL = photoURLInputEl.value;

  updateProfile(auth.currentUser, {
    displayName: newDisplayName,
    photoURL: newPhotoURL,
  })
    .then(() => {
      console.log("Profile updated");
    })
    .catch((error) => {
      console.error(error.message);
    });
}

/* ==== Initialize an instance of Cloud Firestore:====== */
// https://firebase.google.com/docs/firestore/quickstart#initialize
/* = Functions - Firebase - Cloud Firestore = */

async function addPostToDB(postBody, user) {
  /*  Challenge:
		Import collection and addDoc from 'firebase/firestore'

        Use the code from the documentaion to make this function work.
        https://firebase.google.com/docs/firestore/quickstart#add_data

        for custom document id
        https://firebase.google.com/docs/firestore/manage-data/add-data#set_a_document
        
        The function should add a new document to the "posts" collection in Firestore.
        
        The document should contain a field called 'body' of type "string" with a value of
        postBody (from function parameter)
        
        If the document was written successfully, then console log
        "Document written with ID: {documentID}"
        Where documentID is the actual ID of the newly created document.
        
        If something went wrong, then you should log the error message using console.error
    */

  //recommended with auto id
  try {
    const docRef = await addDoc(collection(db, "posts"), {
      body: postBody,
      // Challenge: Add a field called 'uid' where you save the user uid as a string
      uid: user.uid,
      /* Challenge: Add a field called 'createdAt' where you save the time of creation of         this post as a timestamp.
			    You'll need to use the serverTimestamp function, which needs to be imported from "firebase/firestore" first. 
          https://cloud.google.com/firestore/docs/manage-data/add-data#server_timestamp*/
      createdAt: serverTimestamp(),
      // Challenge: Add a field called 'mood' of type number where you save the moodState
      mood: moodState,
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (error) {
    console.error(error.message);
  }

  //for custom document id post01//put below code inside try by replacing old as
  // try {
  //   await setDoc(doc(db, "cities", "post01"), {
  //     body: postBody
  //   });
  // } catch (error) {
  //   console.error(error.message);
  // }
}

function displayDate(firebaseDate) {
  if (!firebaseDate) {  //onsnapshot work immediately but creation of date during submitting post take time//to avoid this error
    return "Date processing"
}
  const date = firebaseDate.toDate();

  const day = date.getDate();
  const year = date.getFullYear();

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = monthNames[date.getMonth()];

  let hours = date.getHours();
  let minutes = date.getMinutes();
  hours = hours < 10 ? "0" + hours : hours;
  minutes = minutes < 10 ? "0" + minutes : minutes;

  return `${day} ${month} ${year} - ${hours}:${minutes}`;
}

/* = Functions - UI Functions - Mood = */

function selectMood(event) {
  const selectedMoodEmojiElementId = event.currentTarget.id;

  changeMoodsStyleAfterSelection(selectedMoodEmojiElementId, moodEmojiEls);

  const chosenMoodValue = returnMoodValueFromElementId(
    selectedMoodEmojiElementId
  );

  moodState = chosenMoodValue;
}

function changeMoodsStyleAfterSelection(
  selectedMoodElementId,
  allMoodElements
) {
  for (let moodEmojiEl of moodEmojiEls) {
    if (selectedMoodElementId === moodEmojiEl.id) {
      moodEmojiEl.classList.remove("unselected-emoji");
      moodEmojiEl.classList.add("selected-emoji");
    } else {
      moodEmojiEl.classList.remove("selected-emoji");
      moodEmojiEl.classList.add("unselected-emoji");
    }
  }
}

function resetAllMoodElements(allMoodElements) {
  for (let moodEmojiEl of allMoodElements) {
    moodEmojiEl.classList.remove("selected-emoji");
    moodEmojiEl.classList.remove("unselected-emoji");
  }

  moodState = 0;
}

function returnMoodValueFromElementId(elementId) {
  return Number(elementId.slice(5));
}

/* == Functions - UI Functions - Date Filters == */

function resetAllFilterButtons(allFilterButtons) {
  for (let filterButtonEl of allFilterButtons) {
      filterButtonEl.classList.remove("selected-filter")
  }
}

function updateFilterButtonStyle(element) {
  element.classList.add("selected-filter")
}

function fetchPostsFromPeriod(period, user) {
  if (period === "today") {
      fetchTodayPosts(user)
  } else if (period === "week") {
      fetchWeekPosts(user)
  } else if (period === "month") {
      fetchMonthPosts(user)
  } else {
      fetchAllPosts(user)
  }
}

function selectFilter(event) {
  const user = auth.currentUser
  
  const selectedFilterElementId = event.target.id
  
  const selectedFilterPeriod = selectedFilterElementId.split("-")[0]
  
  const selectedFilterElement = document.getElementById(selectedFilterElementId)
  
  resetAllFilterButtons(filterButtonEls)
  
  updateFilterButtonStyle(selectedFilterElement)

  // fetchTodayPosts(user)
  // fetchWeekPosts(user)
  // fetchMonthPosts(user)
  fetchPostsFromPeriod(selectedFilterPeriod, user)
}


//for delete
// https://firebase.google.com/docs/firestore/manage-data/delete-data#delete_documents
async function deletePostFromDB(docId) {
  /* Challenge:
      Import deleteDoc and doc from 'firebase/firestore'
      
      Use the code from the documentation to make this function work.
      
      The function should delete the correct post in the database using the docId
   */
      await deleteDoc(doc(db, collectionName, docId))
}
