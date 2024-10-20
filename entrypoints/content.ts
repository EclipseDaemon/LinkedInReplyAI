import ai_icon from "@/assets/AI_Icon.svg";
import chat_icon from "@/assets/Chat_Icon.svg";
import add_icon from "@/assets/Add_Icon.svg";
import new_text from "@/assets/NewText_Icon.svg";

export default defineContentScript({
  matches: ["*://*.linkedin.com/*"],
  main() {
    document.addEventListener("click", (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      // Check if the click is inside a message input area
      if (
        target.matches(".msg-form__contenteditable") ||
        target.matches(".msg-form__contenteditable > p")
      ) {
        const parentElement =
          target.closest(".msg-form__container") ||
          target.closest(".msg-form__contenteditable > p");

        // Check if the parent element already has the AI icon
        if (
          parentElement &&
          !parentElement.querySelector(".ai-response-icon")
        ) {
          // Create the AI icon
          const icon = document.createElement("img");
          icon.className = "ai-response-icon";
          icon.src = ai_icon;
          icon.alt = "AI Icon";
          icon.style.position = "absolute";
          icon.style.bottom = "0px";
          icon.style.right = "0px";
          icon.style.width = "35px";
          icon.style.height = "35px";
          icon.style.cursor = "pointer";
          icon.style.zIndex = "100";

          parentElement.appendChild(icon);

          // Add event listener to open the modal when the icon is clicked
          icon.addEventListener("click", (event) => {
            event.stopPropagation(); 
            openModal();
          });

          // Show Ai_icon when focus on messageBox
          document.addEventListener("focusin", (event: FocusEvent) => {
            const target = event.target as HTMLElement;
            if (
              target.matches(".msg-form__contenteditable") ||
              target.matches(".msg-form__contenteditable > p")
            ) {
              if (icon) {
                icon.style.display = "block";
              }
            }
          });

          // Hide Ai_icon when not focus on messageBox
          document.addEventListener("focusout", (event: FocusEvent) => {
            const target = event.target as HTMLElement;
            if (
              target.matches(".msg-form__contenteditable") ||
              target.matches(".msg-form__contenteditable > p")
            ) {
              if (icon) {
                icon.style.display = "none";
              }
            }
          });
        }
      }
    });
  },
});

// OpenModal Function
function openModal() {
  const modal = document.createElement("div");
  modal.className = "ai-modal";
  modal.style.position = "fixed";
  modal.style.top = "0";
  modal.style.left = "0";
  modal.style.width = "100%";
  modal.style.height = "100%";
  modal.style.display = "flex";
  modal.style.justifyContent = "center";
  modal.style.alignItems = "center";
  modal.style.backgroundColor = "rgba(0,0,0,0.5)";
  modal.style.zIndex = "101";
  modal.setAttribute("aria-hidden", "false");
  modal.innerHTML = `
    <div id='inner_modal' style="background:white; width:500px; padding:25px; border-radius:15px; ">
      <div style="margin:2rem 0rem;width:auto;height:auto;text-align:right;overflow-y:auto;overflow-x:auto"><span id="userText" style="padding:8px;background:#d1f6d3;color:black;display:none;border-radius:5px;"></span></div>
      <input type="text" id="command-input" placeholder="Your prompt" style="width: 100%; padding: 8px; margin-bottom: 10px; outline:none;">
      <button id="generate-btn" style="margin-left:1rem;background-color: #3B82F6; color: white; padding:8px 20px; display:flex; justify-content:center; align-items:center; column-gap:5px; border-radius:8px;font-size:13px;font-weight:600;float:right;cursor:not-allowed;"><img src=${chat_icon} alt="chat_icon" style="width:15px;height:15px"><span>Generate</span></button>
      <div id="new-btns" style="display:none">
      <button id="regenerate-btn" style="margin-left:1rem;background-color: #3B82F6; color: white; padding:8px 20px;display:flex; justify-content:center; align-items:center; column-gap:5px; border-radius:8px;font-size:13px;font-weight:600;float:right;cursor:not-allowed;"><img src=${new_text} alt="regenrate_icon" style="width:15px;height:15px"><span>Regenerate</span></button>
      <button id="insert-btn" style="margin-left:1rem;background:none; color: #666D80; padding:8px 15px; display:flex; justify-content:center; align-items:center; column-gap:5px; border-radius:8px;border:1px solid #666D80;font-size:13px;font-weight:600;float:right;"><img src=${add_icon} alt="Insert_icon" style="width:15px;height:15px"><span>Insert</span></button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  modal.addEventListener("click", (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    // Check if the click was on the outer modal, not on the inner content
    if (target === modal) {
      modal.remove();
      modal.setAttribute("aria-hidden", "true");
    }
  });

  const input_text = document.getElementById(
    "command-input"
  ) as HTMLInputElement | null;
  const userText = document.getElementById("userText")!;
  const generate = document.getElementById("generate-btn");
  const newBtn = document.getElementById("new-btns");
  const insertBtn = document.getElementById("insert-btn");
  let messageDiv: HTMLDivElement | null = null;

  if (input_text && generate) {
    // Event listener for input change
    input_text.addEventListener("input", () => {
      if (input_text.value.trim() !== "") {
        generate.removeAttribute("disabled");
        generate.style.cursor = "pointer";
      } else {
        generate.setAttribute("disabled", "true");
        generate.style.cursor = "not-allowed";
      }
    });

    generate.addEventListener("click", () => {
      // Check if there is any text in the input field
      if (input_text.value.trim() !== "") {
        userText.textContent = input_text.value;
        userText.style.display = "inline-block";
        input_text.value = "";

        generate.style.display = "none";
        if (newBtn) {
          newBtn.style.display = "block";
        }

        if (!messageDiv) {
          messageDiv = document.createElement("div");
          messageDiv.textContent =
            "Thank you for the opportunity! If you have any more questions or if there's anything else I can help you with, feel free to ask.";
          messageDiv.style.marginTop = "10px";
          messageDiv.style.color = "black";
          messageDiv.style.padding = "8px";
          messageDiv.style.border = "1px solid #d1f6d3";
          messageDiv.style.borderRadius = "5px";
          messageDiv.style.textAlign = "left";

          // Insert the messageDiv below userText
          userText.parentNode?.insertBefore(messageDiv, userText.nextSibling);
        }
        if (insertBtn) {
          insertBtn.style.cursor = "pointer";
          insertBtn.removeAttribute("disabled");

          insertBtn.addEventListener("click", () => {
            const linkedinMsgBox = document.querySelector(
              ".msg-form__contenteditable"
            ) as HTMLElement;

            if (linkedinMsgBox && messageDiv) {
              linkedinMsgBox.focus(); 
              const message = messageDiv.textContent || ""; 
              document.execCommand("insertText", false, message);
              modal.remove(); 
            }
          });
        }
      }
    });
  }
}
