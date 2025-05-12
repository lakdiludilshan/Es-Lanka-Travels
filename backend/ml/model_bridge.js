const { spawn } = require('child_process');
const path = require('path');

class PythonMLBridge {
    constructor() {
        this.pythonPath = 'python';
        this.scriptPath = path.join(__dirname, 'tour_model.py');
        console.log('PythonMLBridge initialized with script path:', this.scriptPath);
    }

    async generateTourPlan(selectedTags, tourDays, budget, travelers, transport) {
        console.log('Generating tour plan with:', { selectedTags, tourDays, budget, travelers, transport });
        
        return new Promise((resolve, reject) => {
            const pythonProcess = spawn(this.pythonPath, [
                this.scriptPath,
                JSON.stringify({
                    selectedTags,
                    tourDays,
                    budget,
                    travelers,
                    transport
                })
            ]);

            let outputData = '';
            let errorData = '';

            pythonProcess.stdout.on('data', (data) => {
                const output = data.toString();
                console.log('Python stdout:', output);
                outputData += output;
            });

            pythonProcess.stderr.on('data', (data) => {
                const error = data.toString();
                console.log('Python stderr:', error);
                errorData += error;
            });

            pythonProcess.on('close', (code) => {
                console.log('Python process exited with code:', code);
                
                if (code !== 0) {
                    // Try to parse the error message from Python
                    try {
                        const errorJson = JSON.parse(errorData);
                        reject(new Error(errorJson.error || 'Unknown Python error'));
                    } catch (e) {
                        // If we can't parse the error as JSON, use the raw error
                        reject(new Error(errorData || `Python process exited with code ${code}`));
                    }
                    return;
                }

                try {
                    const result = JSON.parse(outputData);
                    console.log('Successfully generated tour plan');
                    resolve(result);
                } catch (error) {
                    reject(new Error(`Failed to parse Python output: ${error.message}`));
                }
            });
        });
    }
}

module.exports = PythonMLBridge; 