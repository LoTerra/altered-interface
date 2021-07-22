import React, {useState} from "react";

const FootBar = {
    display: "flex",
    justifyContent: "flex-end"
}
const FootContent = {
    width: "500px",
    display: "flex",
    flex: "wrap",
    justifyContent: "space-between"
}
export default function Footer(){
    const [isDarkMode, setDarkMode] = useState(false)

    function darkMode (){
        setDarkMode(!isDarkMode)
        isDarkMode ? localStorage.theme = 'dark' : localStorage.theme = 'light'
        // On page load or when changing themes, best to add inline in `head` to avoid FOUC
        if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
    }

    return (
        <footer className="container">
            <div style={FootBar}>
                <div style={FootContent}>
                    <a href="">Discord</a>
                    <a href="">GitHub</a>
                    <a href="">Twitter</a>
                    <a href="">Telegram</a>
                    <button onClick={()=> darkMode()}>Dark Mode</button>
                </div>
            </div>
        </footer>
    )
}