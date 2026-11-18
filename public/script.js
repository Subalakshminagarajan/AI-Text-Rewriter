
async function rewriteText() {
    const input = document.getElementById("inputText").value.trim();
    const tone = document.getElementById("tone").value;
    const output = document.getElementById("outputText");
    const loading = document.getElementById("loading");

    if (input === "") {
        alert("Please enter some text first!");
        return;
    }

    loading.classList.remove("hidden");
    output.textContent = "";

    try {
        const response = await fetch("/api/rewrite", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ text: input, tone: tone })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Something went wrong");
        }

        output.textContent = data.rewrittenText;
    } catch (error) {
        output.textContent = "Error: " + error.message;
    } finally {
        loading.classList.add("hidden");
    }
}

function copyText() {
    const text = document.getElementById("outputText").textContent;

    if (!text || text === "Your rewritten text will appear here...") {
        alert("No rewritten text to copy!");
        return;
    }

    navigator.clipboard.writeText(text)
        .then(() => alert("Text copied successfully!"))
        .catch(() => alert("Unable to copy text."));
}
