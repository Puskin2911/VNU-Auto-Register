removeBlockUI()

const resource = {
    login: "http://dangkyhoc.vnu.edu.vn/dang-nhap",
    getSubjects: "http://dangkyhoc.vnu.edu.vn/danh-sach-mon-hoc/1/1",
    confirmSubjects: "http://dangkyhoc.vnu.edu.vn/xac-nhan-dang-ky/1",
    selectSubject: (id) => {
        return "http://dangkyhoc.vnu.edu.vn/chon-mon-hoc/" + id + "/1/1"
    },
    home: "http://dangkyhoc.vnu.edu.vn/dang-ky-mon-hoc-nganh-1"
}

let subjects = {}

if (window.location.href === "http://dangkyhoc.vnu.edu.vn/dang-nhap") {
    login()
} else {

    getSubjects()
        .then(() => {
            chrome.storage.sync.get("classSubjects", (result) => {
                const classSubjects = result["classSubjects"]

                console.log(classSubjects)
                classSubjects.forEach(subject => {
                    const subjectId = subjects[subject];
                    if (subjectId) {
                        selectSubjects(subjectId)
                            .then(() => confirmSubjects())
                    }
                })
                confirmSubjects()
            })
        })
}


function confirmSubjects() {
    $.ajax({
        url: resource.confirmSubjects,
        type: "POST",
        success: function (result) {
            console.log(result)
        }
    });
}

function removeBlockUI() {
    const blockUIElements = document.getElementsByClassName("blockUI")
    while (blockUIElements.length > 0) {
        blockUIElements[0].parentNode.removeChild(blockUIElements[0])
    }
}

async function getSubjects() {
    return $.ajax({
        url: resource.getSubjects,
        type: "POST",
        success: function (result) {
            const tBody = document.createElement("tbody")
            tBody.innerHTML = result

            const htmlSubjects = Array.from(tBody.children)
            htmlSubjects.forEach(subject => {
                const columns = Array.from(subject.children)
                const classSubject = columns[4].innerHTML.trim()

                const firstColumn = columns[0]
                if (firstColumn.firstChild && Array.from(firstColumn.children).length > 0) {
                    subjects[classSubject] = Array.from(firstColumn.children)[0].getAttribute("data-rowindex")
                }
            })
        }
    });
}

async function selectSubjects(id) {
    return $.ajax({
        url: resource.selectSubject(id),
        type: "POST",
        success: function (result) {
            console.log("Select subject successful, id=" + id)
        }
    });
}

function login() {
    const inputToken = document.getElementsByName("__RequestVerificationToken")[0]

    chrome.storage.sync.get("account", (result) => {
        let account = result["account"]
        if (account === undefined) {
            account = initAccount("", "")
        }

        const formData = new FormData()
        formData.append("__RequestVerificationToken", inputToken.value)
        formData.append("LoginName", account.username)
        formData.append("Password", account.password)
        return $.ajax({
            url: resource.login,
            data: formData,
            processData: false,
            contentType: false,
            type: "POST",
            success: (result) => {
                if (result.includes("__RequestVerificationToken")) {
                    console.log("Hihi")
                    alert("Wrong username or password! Update and try again")
                } else {
                    window.location.href = resource.home
                }
            }
        });
    })
}