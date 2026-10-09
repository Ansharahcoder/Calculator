
        // State variables
        let currentMode = 'std'; // 'std' or 'sci'
        let expression = '';
        let isDeg = true;
        let lastAnswer = null;

        const mainDisplay = document.getElementById('main-display');
        const historyDisplay = document.getElementById('history-display');
        const sciKeysExtra = document.getElementById('sci-keys-extra');
        const modeStdBtn = document.getElementById('mode-std');
        const modeSciBtn = document.getElementById('mode-sci');
        const degRadBtn = document.getElementById('deg-rad-btn');

        // Mode Switcher Function
        function switchMode(mode) {
            currentMode = mode;
            if (mode === 'sci') {
                sciKeysExtra.classList.remove('hidden');
                sciKeysExtra.classList.add('grid');
                degRadBtn.classList.remove('hidden');

                modeSciBtn.className = "px-3 py-1.5 rounded-lg transition-all duration-200 bg-indigo-600 text-white shadow-md";
                modeStdBtn.className = "px-3 py-1.5 rounded-lg transition-all duration-200 text-slate-400 hover:text-white";
            } else {
                sciKeysExtra.classList.add('hidden');
                sciKeysExtra.classList.remove('grid');
                degRadBtn.classList.add('hidden');

                modeStdBtn.className = "px-3 py-1.5 rounded-lg transition-all duration-200 bg-indigo-600 text-white shadow-md";
                modeSciBtn.className = "px-3 py-1.5 rounded-lg transition-all duration-200 text-slate-400 hover:text-white";
            }
        }

        // Toggle Degrees / Radians Mode
        function toggleDegRad() {
            isDeg = !isDeg;
            degRadBtn.textContent = isDeg ? 'DEG' : 'RAD';
            degRadBtn.className = isDeg 
                ? "text-xs font-semibold px-2 py-1 bg-slate-800 border border-slate-700 rounded-md text-amber-400 hover:bg-slate-700 transition"
                : "text-xs font-semibold px-2 py-1 bg-slate-800 border border-slate-700 rounded-md text-cyan-400 hover:bg-slate-700 transition";
        }

        // Append values to display
        function appendValue(val) {
            if (expression === '0' && !isNaN(val)) {
                expression = val;
            } else {
                expression += val;
            }
            updateDisplay();
        }

        // Append functional keys (like sin, cos, sqrt)
        function appendFunc(funcName) {
            switch (funcName) {
                case 'sin':
                case 'cos':
                case 'tan':
                case 'log':
                case 'ln':
                case 'sqrt':
                    expression += funcName + '(';
                    break;
                case 'sq':
                    expression += '^2';
                    break;
                case 'inv':
                    expression += '^(-1)';
                    break;
            }
            updateDisplay();
        }

        // Backspace function
        function backspace() {
            if (expression.length > 0) {
                // Remove function names if at end
                const funcs = ['sin(', 'cos(', 'tan(', 'log(', 'ln(', 'sqrt('];
                let removed = false;
                for (let f of funcs) {
                    if (expression.endsWith(f)) {
                        expression = expression.slice(0, -f.length);
                        removed = true;
                        break;
                    }
                }
                if (!removed) {
                    expression = expression.slice(0, -1);
                }
            }
            if (expression === '') expression = '0';
            updateDisplay();
        }

        // Clear everything
        function clearAll() {
            expression = '';
            historyDisplay.textContent = '0';
            mainDisplay.textContent = '0';
        }

        // Clear history line
        function clearHistory() {
            historyDisplay.textContent = '0';
        }

        // Toggle positive / negative
        function toggleSign() {
            if (!expression || expression === '0') return;
            if (expression.startsWith('-')) {
                expression = expression.substring(1);
            } else {
                expression = '-' + expression;
            }
            updateDisplay();
        }

        // Update UI displays
        function updateDisplay() {
            mainDisplay.textContent = expression || '0';
            // Auto scroll display rightwards
            mainDisplay.scrollLeft = mainDisplay.scrollWidth;
        }

        // Factorial helper function
        function factorial(n) {
            if (n < 0) return NaN;
            if (n === 0 || n === 1) return 1;
            let res = 1;
            for (let i = 2; i <= n; i++) res *= i;
            return res;
        }

        // Evaluate Scientific Expression safely
        function calculate() {
            if (!expression) return;

            let parsedExpr = expression;
            
            // Save calculation to history display
            historyDisplay.textContent = expression + ' =';

            try {
                // Replace Constants
                parsedExpr = parsedExpr.replace(/π/g, 'Math.PI');
                parsedExpr = parsedExpr.replace(/e/g, 'Math.E');

                // Replace Operators
                parsedExpr = parsedExpr.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-');
                parsedExpr = parsedExpr.replace(/\^/g, '**');

                // Trigonometry handling (DEG / RAD)
                if (isDeg) {
                    parsedExpr = parsedExpr.replace(/sin\(([^)]+)\)/g, (match, p1) => `Math.sin((${p1}) * Math.PI / 180)`);
                    parsedExpr = parsedExpr.replace(/cos\(([^)]+)\)/g, (match, p1) => `Math.cos((${p1}) * Math.PI / 180)`);
                    parsedExpr = parsedExpr.replace(/tan\(([^)]+)\)/g, (match, p1) => `Math.tan((${p1}) * Math.PI / 180)`);
                } else {
                    parsedExpr = parsedExpr.replace(/sin\(/g, 'Math.sin(');
                    parsedExpr = parsedExpr.replace(/cos\(/g, 'Math.cos(');
                    parsedExpr = parsedExpr.replace(/tan\(/g, 'Math.tan(');
                }

                // Logarithmic & Roots
                parsedExpr = parsedExpr.replace(/log\(/g, 'Math.log10(');
                parsedExpr = parsedExpr.replace(/ln\(/g, 'Math.log(');
                parsedExpr = parsedExpr.replace(/sqrt\(/g, 'Math.sqrt(');

                // Handle Factorials (e.g. 5!)
                parsedExpr = parsedExpr.replace(/(\d+)!/g, (match, p1) => factorial(parseInt(p1)));

                // Evaluate standard percent (%) expression (e.g. 50% -> 0.5)
                parsedExpr = parsedExpr.replace(/(\d+(\.\d+)?)%/g, '($1/100)');

                // Calculate evaluated result
                let result = eval(parsedExpr);

                // Format decimals nicely
                if (typeof result === 'number' && !isNaN(result)) {
                    if (!Number.isInteger(result)) {
                        result = parseFloat(result.toFixed(8)); // Avoid deep precision floating point errors
                    }
                    expression = String(result);
                    mainDisplay.textContent = expression;
                } else {
                    mainDisplay.textContent = 'Error';
                    expression = '';
                }
            } catch (err) {
                mainDisplay.textContent = 'Error';
                expression = '';
            }
        }

        // Keyboard Shortcuts Support
        document.addEventListener('keydown', (event) => {
            const key = event.key;

            if (key >= '0' && key <= '9') appendValue(key);
            else if (key === '.') appendValue('.');
            else if (key === '+') appendValue('+');
            else if (key === '-') appendValue('-');
            else if (key === '*') appendValue('*');
            else if (key === '/') appendValue('/');
            else if (key === '%') appendValue('%');
            else if (key === '(' || key === ')') appendValue(key);
            else if (key === '^') appendValue('^');
            else if (key === 'Enter' || key === '=') {
                event.preventDefault();
                calculate();
            } else if (key === 'Backspace') {
                backspace();
            } else if (key === 'Escape') {
                clearAll();
            }
        });
   