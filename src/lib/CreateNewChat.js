const { addDoc, collection, serverTimestamp } = require("firebase/firestore");
const { db } = require("../../firebase");

async function createNewChat({ session }) {
  await addDoc(collection(db, "users", session?.user?.email, "chats"), {
    userId: session?.user?.email,
    createdAt: serverTimestamp(),
  }).then((res) => {
    return res;
  });
}
module.exports.createNewChat = createNewChat;
