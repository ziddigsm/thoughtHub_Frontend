import {useState} from 'react';
import {FaLinkedin, FaGithub, FaInstagram, FaFacebook, FaTwitter} from 'react-icons/fa';
import './settings.css';

export function Settings() {
    const [settings, setSettings] = useState('about');

    const handleSettings = (setting) => {
        switch (setting) {
            case 'about': 
                return aboutSection();
            case 'socials':
                return socialsSection();
            case 'options':
                return optionsSection();
        }
    }

    return (
    <>
        <h1>Settings</h1>
        <div className='settings'>
        <div>
            <div className="settings-sidebar">
                <ul>
                    <li onClick={()=>setSettings('about')}>About</li>
                    <li onClick={()=>setSettings('socials')}>Socials</li>
                    <li onClick={()=>setSettings('options')}>Options</li>
                </ul>
            </div>
        </div>
        <div>
            {handleSettings(settings)}
        </div>
    </div>
    </>
    )
}

function aboutSection() {
    return (
        <div className='container about'>
            <h2>About</h2>
            <div className='points about'>
            <div>
            <label>Name </label>
            <input type="text" />
            </div>
            <div>
            <label>Username </label>
            <input type="text" />
            </div>
            <div>
            <label>email </label>
            <input type="email" disabled/>
            </div>
            </div>
        </div>
    )
}

function socialsSection() {
    return (
        <div className='container socials'>
            <h2>Social</h2>
            <div className='points socials'>
            <div>
            <FaLinkedin className='social linkedin' />
            <input type="url" />
            </div>
            <div>
            <FaGithub className='social github'/>
            <input type="url" />
            </div>
            <div>
            <FaInstagram className='social instagram'/>
            <input type="url" />
                </div>
            <div>
            <FaFacebook className='social facebook'/>
            <input type="url" />
            </div>
            <div>
            <FaTwitter className='social twitter' />
            <input type="url"/>
            </div>
            </div>
        </div>
    )
}

function optionsSection() {
    return (
        <div>
            <h2>Options</h2>
            <div className='points options'>
            <a>Delete Account</a>
            <a>Logut</a>
            </div>
        </div>
    )
}