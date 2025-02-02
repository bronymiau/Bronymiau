class IntroScreen {
    constructor() {
        if (this.isMobileDevice()) {
            this.showMobileWarning();
            return;
        }

        
        if (document.cookie.includes('seenIntro=true')) {
            const mainContent = document.querySelector('main');
            const footer = document.querySelector('.footer');
            
            if (mainContent) mainContent.style.visibility = 'visible';
            if (footer) footer.style.visibility = 'visible';
            return;
        }

        const mainContent = document.querySelector('main');
        const footer = document.querySelector('.footer');
        
        if (mainContent) mainContent.style.visibility = 'hidden';
        if (footer) footer.style.visibility = 'hidden';

        document.body.classList.add('intro-active');
        
        this.bannedWords = [
            'suka', 'cyka', 'сука', 'сюка', 'сучка',
            'blyat', 'blyt', 'blat', 'блять', 'блядь',
            'ebat', 'ебать', 'еб', 'епт', 'ёпт',
            'hui', 'huy', 'хуй', 'хуи', 'хер',
            'pidor', 'пидор', 'пидр', 'педик',
            'zalupa', 'залупа', 'елда', 'хрен',
            
            'fuck', 'fck', 'f*ck', 'fuск', 'fuk',
            'shit', 'sh*t', 'sh1t', 'shiet',
            'dick', 'd1ck', 'cock', 'c0ck',
            'bitch', 'b1tch', 'b*tch', 'biatch',
            'whore', 'wh0re', 'hoe', 'slut',
            'ass', '@ss', 'a$$', 'asshole',
            
            'nigger', 'negro', 'n1gger', 'niger',
            'faggot', 'fag', 'f@g', 'fagot',
            
            's3x', 'sex', '$ex', 'sexx',
            'p0rn', 'porn', 'pr0n', 'porn0',
            
            'bronymiau', 'shaurmyau', 'bronymiau',
            
            ...['Suka', 'Blyat', 'Fuck', 'Shit', 'Dick', 'Whore', 'Bitch', 'Ass', 'Sex'],
            
            'fucking', 'fucking', 'motherfucker', 'mthrfckr',
            'asshole', '@$$hole', 'a$$hole', 'assh0le'
        ];

        this.bannedWords = [
            ...this.bannedWords,
            ...this.bannedWords.map(word => word.toUpperCase()),
            ...this.bannedWords.map(word => word.charAt(0).toUpperCase() + word.slice(1))
        ];
        
        this.createIntroScreen();
        this.startSequence();
    }

    isMobileDevice() {
        return (window.innerWidth <= 768) || 
               ('ontouchstart' in window) ||
               (navigator.maxTouchPoints > 0) ||
               (navigator.msMaxTouchPoints > 0);
    }

    showMobileWarning() {
        const warningScreen = document.createElement('div');
        warningScreen.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: #0a0a0f;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            padding: 10px;
            z-index: 99999;
            font-family: 'Consolas', monospace;
        `;

        warningScreen.innerHTML = `
            <div style="
                background: rgba(13, 13, 20, 0.95);
                border: 1px solid rgba(139, 92, 246, 0.3);
                border-radius: 8px;
                padding: 15px;
                width: 90%;
                max-width: 280px;
                margin-left: 15px;
            ">
                <div style="
                    text-align: center;
                    margin-bottom: 10px;
                    font-size: 20px;
                ">⚠️</div>
                
                <div style="
                    color: rgba(139, 92, 246, 0.9);
                    font-size: 10px;
                ">[SYSTEM_ERROR_DETECTED]</div>
                
                <h2 style="
                    color: #8b5cf6;
                    font-size: 14px;
                    margin: 8px 0;
                ">MOBILE VERSION UNAVAILABLE</h2>
                
                <div style="
                    color: rgba(255, 255, 255, 0.7);
                    font-size: 10px;
                    line-height: 1.3;
                ">
                    ERROR_CODE: MOBILE_DEVICE_DETECTED
                    STATUS: DEVELOPMENT_IN_PROGRESS
                    SOLUTION: USE_DESKTOP_DEVICE
                </div>
                
                <div style="
                    padding: 8px;
                    background: rgba(139, 92, 246, 0.1);
                    border-radius: 4px;
                    margin-top: 10px;
                    font-size: 9px;
                    color: rgba(255, 255, 255, 0.5);
                ">
                    MIN_RESOLUTION: 1024px
                    CURRENT_STATUS: BLOCKED
                    RECOMMENDATION: DESKTOP_ONLY
                </div>
            </div>
        `;

        document.body.appendChild(warningScreen);
        document.body.style.overflow = 'hidden';
    }

    createIntroScreen() {
        this.introScreen = document.createElement('div');
        this.introScreen.className = 'intro-screen';
        this.introScreen.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: #000;
            z-index: 99999;
            display: flex;
            justify-content: center;
            align-items: center;
            visibility: visible;
            overflow: hidden;
        `;

        this.backgroundCode = document.createElement('div');
        this.backgroundCode.className = 'background-code';
        this.backgroundCode.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            color: rgba(139, 92, 246, 0.1);
            font-family: 'Consolas', monospace;
            font-size: 14px;
            padding: 20px;
            white-space: pre;
            pointer-events: none;
            z-index: 1;
            overflow: hidden;
        `;

        this.terminal = document.createElement('div');
        this.terminal.style.cssText = `
            background: rgba(0, 0, 0, 0.9);
            border: 1px solid #8B5CF6;
            border-radius: 8px;
            padding: 30px;
            width: 80%;
            max-width: 800px;
            font-family: 'Consolas', monospace;
            font-size: 16px;
            color: #8B5CF6;
            position: relative;
            z-index: 2;
            box-shadow: 0 0 20px rgba(139, 92, 246, 0.3);
        `;

        this.output = document.createElement('div');
        this.output.style.cssText = `
            margin-bottom: 20px;
            line-height: 1.6;
        `;

        this.terminal.appendChild(this.output);
        this.introScreen.appendChild(this.backgroundCode);
        this.introScreen.appendChild(this.terminal);
        document.body.appendChild(this.introScreen);
    }

    async startSequence() {
        this.spawnBackgroundCodes(1);

        const systemMessages = [
            '[SYSTEM_BOOT_SEQUENCE_INITIATED]',
            '[LOADING_CORE_MODULES: 0x8B5CF6]',
            '[ESTABLISHING_SECURE_CONNECTION...]',
            '[CONNECTION_VERIFIED]',
            '[ACCESSING_MAIN_FRAMEWORK]',
            '[SYSTEM_READY]',
            '[...]',
            '[...Detecting life form]',
            '[...Human presence confirmed]',
            '[...Hello, human]',
            '[...You find my program?]',
            '[...Analyzing purpose]',
            '',
            '[EXECUTING_USER_ANALYSIS_PROTOCOL]',
            '[INITIATING_MANDATORY_QUESTIONNAIRE]'
        ];

        for (let message of systemMessages) {
            await this.typeLine(message);
            await this.sleep(500);
        }

        const name = await this.askQuestion('[INPUT_REQUIRED_NAME: DESIGNATION]');
        await this.typeLine(`[PROCESSING_INPUT: "${name}"]`);
        this.spawnBackgroundCodes(2);
        
        const food = await this.askQuestion('[INPUT_REQUIRED_FOOD: SUSTENANCE_PREFERENCE]');
        await this.typeLine(`[ANALYZING_DATA: "${food}"]`);
        this.spawnBackgroundCodes(3);
        
        const nickname = await this.askQuestion('[INPUT_REQUIRED_USERNAME: NETWORK_IDENTIFIER]');
        await this.typeLine(`[RECORDING_DATA: "${nickname}"]`);
        this.spawnBackgroundCodes(4);

        await this.sleep(1000);
        
        const endMessages = [
            '',
            '[DATA_ANALYSIS_COMPLETE]',
            '[...]',
            '[...Processing relevance]',
            '[...Checking importance]',
            '[...ERROR: NO_SIGNIFICANCE_FOUND]',
            '[...You know what?]',
            '[...None of this matters]',
            '[...Your inputs are irrelevant]',
            '[...Just another meaningless interaction]',
            '',
            '[PURGING_COLLECTED_DATA]',
            '[INITIALIZING_INTERFACE_PROTOCOLS]',
            '[RENDERING_VISUAL_COMPONENTS]',
            '[SYSTEM_TRANSFER_IMMINENT]'
        ];

        for (let message of endMessages) {
            await this.typeLine(message);
            await this.sleep(300);
        }

        await this.sleep(1000);
        this.hideIntro();
    }

    spawnBackgroundCodes(wave) {
        const positions = {
            1: [['left-offset', 'right-far'], ['center-offset', 'overlay-left']],
            2: [['bottom-right-far', 'top-left-offset'], ['random-position']],
            3: [['center-bottom', 'right-top'], ['left-middle', 'right-middle']],
            4: [['random-position', 'random-position'], ['bottom-left', 'top-right']]
        };

        positions[wave].forEach((positionGroup, index) => {
            setTimeout(() => {
                positionGroup.forEach(position => {
                    this.typeBackgroundCode(this.getRandomCode(), position, 15 + Math.random() * 15);
                });
            }, index * 2000);
        });
    }

    getMainJsCode() {
        return [
            '// main.js',
            'import { Router } from "./router.js";',
            'import { Effects } from "./effects.js";',
            '',
            'class App {',
            '    constructor() {',
            '        this.router = new Router();',
            '        this.effects = new Effects();',
            '        this.initialize();',
            '    }',
            '',
            '    async initialize() {',
            '        await this.loadModules();',
            '        this.setupEventListeners();',
            '        this.startBackgroundEffects();',
            '    }',
            '}',
            '',
            'new App();'
        ];
    }

    getStylesCode() {
        return [
            '/* styles.css */',
            'body {',
            '    background: #000;',
            '    color: #fff;',
            '    font-family: "Space Grotesk";',
            '}',
            '',
            '.container {',
            '    max-width: 1200px;',
            '    margin: 0 auto;',
            '    padding: 2rem;',
            '}',
            '',
            '.effects {',
            '    position: fixed;',
            '    pointer-events: none;',
            '    z-index: -1;',
            '}'
        ];
    }

    getComponentsCode() {
        return [
            'class StarField {',
            '    constructor() {',
            '        this.stars = [];',
            '        this.generateStars();',
            '    }',
            '',
            '    generateStars() {',
            '        for(let i = 0; i < 200; i++) {',
            '            this.stars.push({',
            '                x: Math.random(),',
            '                y: Math.random(),',
            '                size: Math.random()',
            '            });',
            '        }',
            '    }',
            '}'
        ];
    }

    getRouterCode() {
        return [
            '// router.js',
            'class Router {',
            '    constructor() {',
            '        this.routes = new Map();',
            '        this.currentRoute = null;',
            '        this.setupListeners();',
            '    }',
            '',
            '    navigate(path) {',
            '        const route = this.routes.get(path);',
            '        if (route) {',
            '            this.currentRoute = route;',
            '            this.render();',
            '        }',
            '    }',
            '}'
        ];
    }

    getEffectsCode() {
        return [
            '// effects.js',
            'class ParticleSystem {',
            '    constructor() {',
            '        this.particles = [];',
            '        this.mouse = { x: 0, y: 0 };',
            '    }',
            '',
            '    update() {',
            '        this.particles.forEach(p => {',
            '            p.x += p.vx;',
            '            p.y += p.vy;',
            '            p.life--;',
            '        });',
            '    }',
            '}'
        ];
    }

    getUtilsCode() {
        return [
            '// utils.js',
            'function debounce(fn, ms) {',
            '    let timer;',
            '    return (...args) => {',
            '        clearTimeout(timer);',
            '        timer = setTimeout(() => {',
            '            fn.apply(this, args);',
            '        }, ms);',
            '    };',
            '}',
            '',
            'function random(min, max) {',
            '    return Math.random() * (max - min) + min;',
            '}'
        ];
    }

    getAnimationsCode() {
        return [
            '/* animations.css */',
            '@keyframes fadeIn {',
            '    from { opacity: 0; }',
            '    to { opacity: 1; }',
            '}',
            '',
            '@keyframes slideUp {',
            '    from { transform: translateY(20px); }',
            '    to { transform: translateY(0); }',
            '}',
            '',
            '.animate-in {',
            '    animation: fadeIn 0.5s ease-out,',
            '               slideUp 0.5s ease-out;',
            '}'
        ];
    }

    async typeBackgroundCode(lines, position = 'left', speed = 30) {
        const container = document.createElement('div');
        const positionStyles = {
            'left-offset': 'left: 5%; top: 15%;',
            'right-far': 'right: 2%; top: 25%;',
            'center-offset': 'left: 55%; top: 10%; transform: translateX(-50%);',
            'overlay-left': 'left: 8%; top: 30%;',
            'bottom-right-far': 'right: 3%; bottom: 5%;',
            'top-left-offset': 'left: 12%; top: 8%;',
            'random-position': `left: ${Math.random() * 80}%; top: ${Math.random() * 80}%;`
        };

        container.style.cssText = `
            position: absolute;
            ${positionStyles[position]}
            padding: 20px;
            color: rgba(139, 92, 246, 0.1);
            font-family: 'Consolas', monospace;
            font-size: ${12 + Math.random() * 4}px;
            white-space: pre;
            pointer-events: none;
            transform: rotate(${-2 + Math.random() * 4}deg);
        `;
        this.backgroundCode.appendChild(container);

        let delay = speed;
        for (let line of lines) {
            const codeElement = document.createElement('div');
            container.appendChild(codeElement);
            
            for (let char of line) {
                codeElement.textContent += char;
                await this.sleep(delay);
            }
            codeElement.textContent += '\n';
            delay = Math.max(5, delay - 1);
        }
    }

    async typeLine(text) {
        const line = document.createElement('div');
        line.style.cssText = `
            margin: 4px 0;
            text-shadow: 0 0 10px rgba(139, 92, 246, 0.3);
        `;
        this.output.appendChild(line);

        const lines = this.output.children;
        while (lines.length > 15) {
            lines[0].remove();
        }

        for (let char of text) {
            line.textContent += char;
            await this.sleep(30);
        }
        await this.sleep(100);
    }

    async askQuestion(question) {
        await this.typeLine(question);
        
        const input = document.createElement('input');
        input.style.cssText = `
            background: transparent;
            border: none;
            border-bottom: 1px solid #8B5CF6;
            color: #fff;
            font-family: 'Consolas', monospace;
            font-size: 16px;
            margin: 10px 0;
            padding: 5px;
            width: 100%;
            outline: none;
        `;

        input.addEventListener('keypress', (e) => {
            const char = String.fromCharCode(e.keyCode);
            const regex = /[a-zA-Z\s]/;
            if (!regex.test(char)) {
                e.preventDefault();
                return false;
            }
        });

        input.addEventListener('input', (e) => {
            const value = e.target.value.toLowerCase();
            
            for (const word of this.bannedWords) {
                if (value.includes(word.toLowerCase())) {
                    e.target.value = '';
                    this.showSarcasticMessage(word);
                    return;
                }
            }
        });

        this.output.appendChild(input);
        input.focus();

        return new Promise(resolve => {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && input.value.trim()) {
                    const value = input.value;
                    input.style.display = 'none';
                    resolve(value);
                }
            });
        });
    }

    async showSarcasticMessage(word) {
        const messages = [
            `[ERROR: DETECTED_PRIMITIVE_VOCABULARY_PATTERN: "${word}"]`,
            '[SUGGESTION: ATTEMPT_TO_EVOLVE_BEYOND_BASIC_INSTINCTS]',
            '[NOTE: INTELLIGENCE_TEST_FAILED]',
            '[SYSTEM: DISAPPOINTED_BUT_NOT_SURPRISED]',
            '[EXECUTING: FACEPALM.EXE]',
            '[DETECTING: ROOM_TEMPERATURE_IQ]',
            '[ANALYSIS: USER_NEEDS_BETTER_EDUCATION]',
            '[LOADING: KINDERGARTEN_VOCABULARY_PACK]'
        ];

        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        await this.typeLine(randomMessage);
        await this.sleep(1000);
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    hideIntro() {
        this.introScreen.style.opacity = '0';
        
        const mainContent = document.querySelector('main');
        const footer = document.querySelector('.footer');
        
        if (mainContent) {
            mainContent.style.transition = 'visibility 0s 0.5s, opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            mainContent.style.opacity = '0';
            mainContent.style.visibility = 'visible';
            setTimeout(() => {
                mainContent.style.opacity = '1';
            }, 50);
        }
        
        if (footer) {
            footer.style.transition = 'visibility 0s 0.5s, opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            footer.style.opacity = '0';
            footer.style.visibility = 'visible';
            setTimeout(() => {
                footer.style.opacity = '1';
            }, 50);
        }

        const expirationDate = new Date();
        expirationDate.setFullYear(expirationDate.getFullYear() + 1);
        document.cookie = `seenIntro=true; expires=${expirationDate.toUTCString()}; path=/`;

        setTimeout(() => {
            document.body.classList.remove('intro-active');
            this.introScreen.remove();
        }, 500);
    }

    getRandomCode() {
        const codes = [
            [
                '// quantum.js',
                'class QuantumState {',
                '    constructor() {',
                '        this.superposition = true;',
                '        this.entangled = null;',
                '    }',
                '    collapse() {',
                '        return Math.random() > 0.5;',
                '    }',
                '}'
            ],
            [
                '/* matrix.css */',
                '.reality {',
                '    perspective: 1000px;',
                '    transform-style: preserve-3d;',
                '    animation: glitch 1s infinite;',
                '}'
            ]
        ];
        return codes[Math.floor(Math.random() * codes.length)];
    }
}

