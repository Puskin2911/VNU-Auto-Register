const addBtn = document.getElementById("add-btn")
const updateAccountBtn = document.getElementById("update-account-btn")
const toggleBtn = document.getElementById("toggle-btn")

showAccountInfo()
showTargetSubjects()
handleOnOff()

toggleBtn.addEventListener("click", () => {
    chrome.storage.sync.get("isEnable", (result) => {
        let isEnable = result["isEnable"]
        isEnable = !isEnable

        chrome.storage.sync.set({isEnable}, () => handleOnOff())
    })
})

updateAccountBtn.addEventListener("click", () => {
    const inputUsername = document.getElementById("inputUsername")
    const inputPassword = document.getElementById("inputPassword")

    const account = initAccount(inputUsername.value, inputPassword.value)

    chrome.storage.sync.set({account}, () => showAccountInfo())
})

addBtn.addEventListener("click", () => {
    const input = document.getElementById("inputSubject")

    chrome.storage.sync.get("classSubjects", result => {
        let classSubjects = result["classSubjects"];
        if (classSubjects === undefined) {
            classSubjects = []
        }

        const value = input.value.trim();
        if (value.length > 0) {
            classSubjects.push(value)
        }

        input.value = ""

        chrome.storage.sync.set({classSubjects}, () => showTargetSubjects())
    })


})

function showAccountInfo() {
    chrome.storage.sync.get("account", (result) => {
        let account = result["account"]
        if (account === undefined) {
            account = initAccount("", "")
        }

        const inputUsername = document.getElementById("inputUsername")
        const inputPassword = document.getElementById("inputPassword")

        inputUsername.value = account.username
        inputPassword.value = account.password
    })
}

function initAccount(username, password) {
    return {
        username: username,
        password: password
    }
}

function showTargetSubjects() {
    const subjectContainer = document.getElementById("subject-container")
    subjectContainer.innerHTML = ""

    chrome.storage.sync.get("classSubjects", (result) => {
        let classSubjects = result["classSubjects"]

        if (classSubjects === undefined) {
            classSubjects = []
        }

        console.log(classSubjects)

        classSubjects.forEach(subject => {
            const row = document.createElement("div")
            row.className = "row py-1 justify-content-center"
            subjectContainer.appendChild(row)

            const subjectCol = document.createElement("div")
            subjectCol.innerHTML = subject
            subjectCol.className = "col-5"

            const removeCol = document.createElement("div")
            removeCol.className = "col-3"
            removeCol.addEventListener("click", () => handleRemove(subject))

            const removeBtn = document.createElement("button")
            removeBtn.innerHTML = "Remove"
            removeBtn.className = "btn btn-outline-danger btn-sm"
            removeCol.appendChild(removeBtn)

            row.appendChild(subjectCol)
            row.appendChild(removeCol)
        })
    })
}

function handleRemove(subjectId) {
    chrome.storage.sync.get("classSubjects", result => {
        let classSubjects = result["classSubjects"];

        const newClassSubject = []
        classSubjects.forEach(subject => {
            if (subject !== subjectId) {
                newClassSubject.push(subject)
            }
        })

        classSubjects = [...newClassSubject]

        chrome.storage.sync.set({classSubjects}, () => showTargetSubjects())
    })
}

function handleOnOff() {
    const bodyContainer = document.getElementById("body-container")

    chrome.storage.sync.get("isEnable", (result) => {
        const isEnable = result["isEnable"]
        const iconElement = document.createElement("i");
        if (isEnable === undefined || isEnable === false) {
            iconElement.className = "fas fa-toggle-off fa-2x text-danger"
            toggleBtn.className = "btn bg-white active p-0"
            bodyContainer.hidden = true
        } else {
            iconElement.className = "fas fa-toggle-on fa-2x text-success"
            toggleBtn.className = "btn bg-white active p-0"
            bodyContainer.hidden = false
        }
        toggleBtn.innerHTML = ""
        toggleBtn.appendChild(iconElement)
    })
}