<template>
  <div class="view login" v-if="state.username === '' || state.username === null">
    <form class="login-form" @submit.prevent="Login">
      <div class="form-inner">
        <h1>Login to Chat-k</h1>
        <label for="username">Username</label>
        <input 
          type="text" 
          v-model="inputUsername" 
          placeholder="Please enter your username..." />
        <input 
          type="submit" 
          value="Login" />
      </div>
    </form>
  </div>
  
  <div class="view chat" v-else>
    <header>
      <button class="logout" @click="Logout">Logout</button>
      <h1>Welcome, {{ state.username }}</h1>
    </header>
    
    <section class="chat-box">
      <div 
        v-for="message in state.messages" 
        :key="message.key" 
        :class="(message.username == state.username ? 'message current-user' : 'message')">
        <div class="message-inner">
          <div class="username">{{ message.username }}</div>
          <div class="content">{{ message.content }}</div>
        </div>
      </div>
    </section>

    <footer>
      <form @submit.prevent="SendMessage">
        <input 
          type="text" 
          v-model="inputMessage" 
          placeholder="Write a message..." />
        <input 
          type="submit" 
          value="Send" />
      </form>
    </footer>
  </div>
</template>

<script>
import { reactive, onMounted, ref } from 'vue';
import db from './db';
import { getDatabase, ref as dbRef, onValue, push } from 'firebase/database'; // Updated import statement

export default {
  setup () {
    const inputUsername = ref("");
    const inputMessage = ref("");

    const state = reactive({
      username: "",
      messages: []
    });

    const Login = () => {
      if (inputUsername.value != "" || inputUsername.value != null) {
        state.username = inputUsername.value;
        inputUsername.value = "";
      }
    }

    const Logout = () => {
      state.username = "";
    }

    const SendMessage = () => {
      const messagesRef = dbRef(getDatabase(), "messages");

      if (inputMessage.value === "" || inputMessage.value === null) {
        return;
      }

      const message = {
        username: state.username,
        content: inputMessage.value
      }

      push(messagesRef, message);
      inputMessage.value = "";
    }

    onMounted(() => {
      const messagesRef = dbRef(getDatabase(), "messages");

      // Listen for changes using onValue instead of on
      onValue(messagesRef, (snapshot) => {
        const data = snapshot.val();
        let messages = [];

        for (let key in data) {
          messages.push({
            id: key,
            username: data[key].username,
            content: data[key].content
          });
        }

        state.messages = messages;
      });
    });

    return {
      inputUsername,
      Login,
      state,
      inputMessage,
      SendMessage,
      Logout
    }
  }
}
</script>

<style lang="scss">
* {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;

    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

.view {
    display: flex;
    justify-content: center;
    min-height: 100vh;
    background-color: #5b8ac7; // bluish background

    &.login {
        align-items: center;
        .login-form {
            display: block;
            width: 100%;
            padding: 30px; // Increased padding
            
            .form-inner {
                display: block;
                background-color: #f0f6ff; // Lighter bluish background
                padding: 40px; // Increased padding
                border-radius: 20px; // Smoother border
                box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1); // Softer shadow

                h1 {
                    color: #3a639e; // Slightly darker bluish text
                    font-size: 32px; // Larger font size
                    margin-bottom: 40px; // Increased margin
                }

                label {
                    display: block;
                    margin-bottom: 10px; // Increased margin
                    color: #3a639e; // Slightly darker bluish text
                    font-size: 18px; // Increased font size
                    transition: 0.4s;
                }

                input[type="text"] {
                    appearance: none;
                    border: none;
                    outline: none;
                    background: none;

                    display: block;
                    width: 100%;
                    padding: 15px;
                    border-radius: 10px; // Smoother border
                    margin-bottom: 20px; // Increased margin
                    
                    color: #3a639e; // Bluish text
                    font-size: 20px; // Increased font size

                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); // Softer shadow
                    background-color: #e6f0ff; // Light bluish background

                    transition: 0.4s;

                    &::placeholder {
                        color: #7ba4e0; // Light bluish placeholder
                        transition: 0.4s;
                    }
                }

                input[type="submit"] {
                    appearance: none;
                    border: none;
                    outline: none;
                    background: none;

                    display: block;
                    width: 100%;
                    padding: 15px;
                    background-color: #3a639e; // Slightly darker bluish button
                    border-radius: 10px; // Smoother border

                    color: #fff; // White text
                    font-size: 20px; // Increased font size
                    font-weight: 700;
                    cursor: pointer; // Cursor pointer on hover
                    transition: background-color 0.4s;
                }

                &:focus-within {
                    label {
                        color: #5b8ac7; // Bluish text
                    }

                    input[type="text"] {
                        background-color: #f0f6ff; // Lighter bluish background
                        box-shadow: 0 0 15px rgba(0, 0, 0, 0.2); // Softer shadow

                        &::placeholder {
                            color: #7ba4e0; // Light bluish placeholder
                        }
                    }
                }
            }
        }
    }

    &.chat {
        flex-direction: column;

        header {
            position: relative;
            display: block;
            width: 100%;
            padding: 40px 30px 20px; // Increased padding

            .logout {
                position: absolute;
                top: 20px; // Adjusted position
                right: 20px; // Adjusted position
                appearance: none;
                border: none;
                outline: none;
                background: none;
                
                color: #fff; // White text
                font-size: 20px; // Increased font size
                text-align: right;
                cursor: pointer; // Cursor pointer on hover
                transition: color 0.4s;
            }

            h1 {
                color: #fff; // White text
                font-size: 32px; // Increased font size
            }
        }

        .chat-box {
            border-radius: 20px 20px 0 0; // Smoother border
            background-color: #f0f6ff; // Lighter bluish background
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1); // Softer shadow
            flex: 1 1 100%;
            padding: 40px; // Increased padding

            .message {
                display: flex;
                margin-bottom: 30px; // Increased margin
                
                .message-inner {
                    .username {
                        color: #7ba4e0; // Light bluish text
                        font-size: 18px; // Increased font size
                        margin-bottom: 10px; // Increased margin
                        padding: 0 15px; // Adjusted padding
                    }

                    .content {
                        display: inline-block;
                        padding: 15px 25px; // Increased padding
                        background-color: #d8e6ff; // Lighter bluish background
                        border-radius: 20px; // Smoother border

                        color: #3a639e; // Bluish text
                        font-size: 20px; // Increased font size
                        line-height: 1.4em; // Increased line height
                        text-align: left;
                    }
                }

                &.current-user {
                    margin-top: 30px; // Increased margin
                    justify-content: flex-end;
                    text-align: right;

                    .message-inner {
                        max-width: 70%; // Adjusted width

                        .content {
                            color: #fff; // White text
                            font-weight: 600;
                            background-color: #5b8ac7; // Bluish background
                        }
                    }
                }
            }
        }

        footer {
            position: sticky;
            bottom: 0;
            background-color: #f0f6ff; // Lighter bluish background
            padding: 40px; // Increased padding
            box-shadow: 0 -10px 20px rgba(0, 0, 0, 0.1); // Softer shadow

            form {
                display: flex;

                input[type="text"] {
                    flex: 1;

                    appearance: none;
                    border: none;
                    outline: none;
                    background: none;

                    display: block;
                    width: 100%;
                    padding: 15px;
                    border-radius: 10px 0 0 10px; // Smoother border
                    
                    color: #3a639e; // Bluish text
                    font-size: 20px; // Increased font size

                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); // Softer shadow
                    background-color: #e6f0ff; // Light bluish background

                    transition: 0.4s;

                    &::placeholder {
                        color: #7ba4e0; // Light bluish placeholder
                    }
                }
                
                input[type="submit"] {
                    appearance: none;
                    border: none;
                    outline: none;
                    background: none;

                    display: block;
                    padding: 15px 25px; // Increased padding
                    border-radius: 0 10px 10px 0; // Smoother border

                    background-color: #3a639e; // Slightly darker bluish button

                    color: #fff; // White text
                    font-size: 20px; // Increased font size
                    font-weight: 700;
                    cursor: pointer; // Cursor pointer on hover
                    transition: background-color 0.4s;
                }
            }
        }
    }
}
</style>
