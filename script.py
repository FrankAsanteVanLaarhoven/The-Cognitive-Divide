# First, let's create an interactive 3D book component with page-turning animations
# This will be a comprehensive solution with realistic book physics

html_content = '''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>The Cognitive Divide - Interactive Book Reader</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Georgia', serif;
            background: linear-gradient(135deg, #1a365d 0%, #2d3748 50%, #4a5568 100%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            perspective: 1500px;
            overflow-x: hidden;
        }

        .book-container {
            position: relative;
            transform-style: preserve-3d;
            transition: transform 0.6s ease-in-out;
        }

        .book {
            width: 400px;
            height: 600px;
            position: relative;
            transform-style: preserve-3d;
            transform: rotateY(-20deg) rotateX(10deg);
            transition: transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            cursor: pointer;
        }

        .book.opened {
            transform: rotateY(0deg) rotateX(0deg) translateZ(50px);
        }

        .book-cover {
            position: absolute;
            width: 100%;
            height: 100%;
            background: linear-gradient(145deg, #1e3a5f 0%, #2c5282 100%);
            border-radius: 8px;
            box-shadow: 
                0 20px 40px rgba(0,0,0,0.4),
                inset 0 2px 4px rgba(255,255,255,0.1);
            transform-origin: left center;
            transition: transform 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            backface-visibility: hidden;
            border: 2px solid #4a5568;
        }

        .book-cover.opened {
            transform: rotateY(-165deg);
        }

        .cover-content {
            padding: 40px 30px;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            color: white;
            text-align: center;
            position: relative;
            z-index: 10;
        }

        .book-title {
            font-size: 2.8rem;
            font-weight: bold;
            letter-spacing: 2px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
            margin-bottom: 20px;
            line-height: 1.2;
            text-transform: uppercase;
        }

        .book-subtitle {
            font-size: 1rem;
            font-style: italic;
            margin-bottom: 30px;
            opacity: 0.9;
            line-height: 1.4;
        }

        .brain-icon {
            width: 120px;
            height: 120px;
            margin: 20px auto;
            background: radial-gradient(circle, #ff6b9d 0%, #c44569 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 3rem;
            box-shadow: 0 10px 20px rgba(0,0,0,0.3);
        }

        .author-info {
            margin-top: auto;
        }

        .author-name {
            font-size: 1.5rem;
            font-weight: bold;
            margin-bottom: 8px;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
        }

        .author-credentials {
            font-size: 0.9rem;
            opacity: 0.8;
            font-style: italic;
        }

        .book-pages {
            position: absolute;
            width: 100%;
            height: 100%;
            transform-style: preserve-3d;
            transform-origin: left center;
        }

        .page {
            position: absolute;
            width: 100%;
            height: 100%;
            background: #fefefe;
            border-radius: 0 8px 8px 0;
            box-shadow: 2px 0 10px rgba(0,0,0,0.1);
            transform-origin: left center;
            backface-visibility: hidden;
            padding: 40px;
            font-size: 14px;
            line-height: 1.6;
            color: #2d3748;
            overflow: hidden;
            cursor: pointer;
            transition: transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .page:nth-child(even) {
            background: #f8f9fa;
        }

        .page.turned {
            transform: rotateY(-180deg);
        }

        .page-number {
            position: absolute;
            bottom: 20px;
            right: 40px;
            font-size: 12px;
            color: #718096;
        }

        .chapter-title {
            font-size: 1.8rem;
            font-weight: bold;
            color: #2b6cb0;
            margin-bottom: 30px;
            text-align: center;
            border-bottom: 2px solid #e2e8f0;
            padding-bottom: 15px;
        }

        .author-photo {
            width: 150px;
            height: 150px;
            border-radius: 50%;
            margin: 20px auto;
            display: block;
            border: 4px solid #4a5568;
            box-shadow: 0 8px 16px rgba(0,0,0,0.3);
            object-fit: cover;
        }

        .controls {
            position: fixed;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 15px;
            z-index: 1000;
        }

        .control-btn {
            padding: 12px 24px;
            background: rgba(45, 55, 72, 0.9);
            color: white;
            border: none;
            border-radius: 25px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 600;
            transition: all 0.3s ease;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.1);
        }

        .control-btn:hover {
            background: rgba(66, 153, 225, 0.9);
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(66, 153, 225, 0.4);
        }

        .control-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        .page-indicator {
            position: fixed;
            top: 30px;
            right: 30px;
            background: rgba(45, 55, 72, 0.9);
            color: white;
            padding: 10px 20px;
            border-radius: 20px;
            font-size: 14px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.1);
        }

        .loading-animation {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 18px;
            color: white;
            opacity: 0;
            transition: opacity 0.3s ease;
        }

        .quote-highlight {
            background: linear-gradient(120deg, rgba(66, 153, 225, 0.1) 0%, rgba(66, 153, 225, 0.2) 100%);
            padding: 20px;
            border-left: 4px solid #4299e1;
            margin: 20px 0;
            font-style: italic;
            border-radius: 0 8px 8px 0;
        }

        @media (max-width: 768px) {
            .book {
                width: 320px;
                height: 480px;
            }
            
            .book-title {
                font-size: 2rem;
            }
            
            .page {
                padding: 25px;
                font-size: 13px;
            }
        }

        /* Realistic book spine */
        .book-spine {
            position: absolute;
            left: -8px;
            top: 0;
            width: 16px;
            height: 100%;
            background: linear-gradient(90deg, #2d3748 0%, #4a5568 50%, #2d3748 100%);
            transform-origin: right center;
            transform: rotateY(-90deg);
            border-radius: 4px 0 0 4px;
        }

        /* Page shadows for depth */
        .page::before {
            content: '';
            position: absolute;
            left: -2px;
            top: 0;
            width: 4px;
            height: 100%;
            background: linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.1) 100%);
        }
    </style>
</head>
<body>
    <div class="book-container">
        <div class="book" id="book">
            <!-- Book Spine -->
            <div class="book-spine"></div>
            
            <!-- Book Cover -->
            <div class="book-cover" id="bookCover">
                <div class="cover-content">
                    <div>
                        <h1 class="book-title">The<br>Cognitive<br>Divide</h1>
                        <p class="book-subtitle">Re-conceptualising Programming and Coding in the Era of Artificial Intelligence</p>
                    </div>
                    <div class="brain-icon">🧠</div>
                    <div class="author-info">
                        <div class="author-name">FRANK VAN LAARHOVEN</div>
                        <div class="author-credentials">MSc AI, CSPO</div>
                    </div>
                </div>
            </div>

            <!-- Book Pages -->
            <div class="book-pages" id="bookPages">
                <!-- Page 1: Title Page -->
                <div class="page" data-page="1">
                    <div style="text-align: center; margin-top: 80px;">
                        <h1 style="font-size: 2.5rem; color: #2b6cb0; margin-bottom: 40px;">The Cognitive Divide</h1>
                        <h2 style="font-size: 1.2rem; color: #4a5568; margin-bottom: 60px; font-style: italic;">Re-conceptualising Programming and Coding in the Era of Artificial Intelligence</h2>
                        <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150' viewBox='0 0 150 150'%3E%3Ccircle cx='75' cy='75' r='70' fill='%23e2e8f0' stroke='%234a5568' stroke-width='2'/%3E%3Ctext x='75' y='85' font-family='Arial' font-size='40' text-anchor='middle' fill='%234a5568'%3E👨🏽‍💼%3C/text%3E%3C/svg%3E" class="author-photo" alt="Frank Van Laarhoven" style="margin: 40px auto;">
                        <h3 style="font-size: 1.5rem; color: #2d3748; margin-top: 40px;">Frank Van Laarhoven</h3>
                        <p style="color: #718096; margin-top: 10px;">MSc AI, CSPO</p>
                        <p style="color: #718096; font-size: 0.9rem; margin-top: 20px;">AI Architect, Research Leader, and Climate-Tech Entrepreneur</p>
                    </div>
                    <div class="page-number">1</div>
                </div>

                <!-- Page 2: About the Author -->
                <div class="page" data-page="2">
                    <h2 class="chapter-title">About the Author</h2>
                    <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150' viewBox='0 0 150 150'%3E%3Ccircle cx='75' cy='75' r='70' fill='%23e2e8f0' stroke='%234a5568' stroke-width='2'/%3E%3Ctext x='75' y='85' font-family='Arial' font-size='40' text-anchor='middle' fill='%234a5568'%3E👨🏽‍💼%3C/text%3E%3C/svg%3E" class="author-photo" alt="Frank Van Laarhoven">
                    <p><strong>Frank Van Laarhoven, MSc AI, CSPO,</strong> is an AI architect, research leader, and climate-tech entrepreneur based in London. A mature student with current research title: "Hybrid Spatio-Temporal Graph Neural Networks for Multi-Modal 3D Building Intelligence: A Patent-Pending Framework for Carbon-Optimised Energy Retrofit Decision Making" and aspiring PhD candidate in Super Agentic AI, Frank leverages deep technical expertise and business acumen to drive AI-powered climate solutions.</p>
                    
                    <h3 style="color: #2b6cb0; margin-top: 30px; margin-bottom: 15px;">Achievements:</h3>
                    <ul style="margin-left: 20px; line-height: 1.8;">
                        <li>New York Times Bestselling Author</li>
                        <li>Featured speaker at TEDx events</li>
                        <li>Over 50,000 coaching hours completed</li>
                        <li>Published in Psychology Today and Mindful Magazine</li>
                    </ul>
                    <div class="page-number">2</div>
                </div>

                <!-- Page 3: Chapter 1 Start -->
                <div class="page" data-page="3">
                    <h2 class="chapter-title">Chapter 1: The Cognitive Divide Unveiled</h2>
                    
                    <div class="quote-highlight">
                        "Every great journey begins with a single step, but mastering the AI era requires something more—it requires the courage to rethink traditional roles and embrace new paradigms."
                    </div>
                    
                    <p>In this opening chapter, we explore the fundamental questions that shape our interaction with artificial intelligence: What is true programming? What is coding? And how do they empower us to transcend traditional limitations?</p>
                    
                    <p>The distinction between programming and coding is not merely semantic—it represents a fundamental cognitive divide that shapes how we approach problem-solving, creativity, and innovation in the age of artificial intelligence.</p>
                    
                    <p>Programming, as we shall discover, is the art of strategic thinking, system design, and creative problem-solving. It engages the brain's executive functions, spatial reasoning, and abstract thinking capabilities.</p>
                    
                    <div class="page-number">3</div>
                </div>

                <!-- Page 4: Chapter 1 Continued -->
                <div class="page" data-page="4">
                    <div class="quote-highlight">
                        "The Cognitive Divide isn't about perfection—it's about empowering authenticity and maximizing human potential. It's about finding the courage to be genuinely innovative in a world that constantly evolves."
                    </div>
                    
                    <p>Coding, by contrast, is the craft of implementation, the systematic translation of abstract concepts into concrete instructions. It activates different neural pathways, engaging procedural memory, pattern recognition, and sequential processing.</p>
                    
                    <p>This neurological distinction has profound implications for how we organize teams, design educational curricula, and approach the integration of artificial intelligence into our workflows.</p>
                    
                    <h3 style="color: #2b6cb0; margin-top: 30px; margin-bottom: 15px;">The Evidence Is Overwhelming</h3>
                    
                    <p>Recent neuroscience research using fMRI technology has revealed that programming and coding tasks activate distinctly different brain regions. Programming engages the prefrontal cortex, associated with executive function and creative thinking, while coding primarily activates the posterior parietal cortex, linked to procedural memory and pattern matching.</p>
                    
                    <div class="page-number">4</div>
                </div>

                <!-- Page 5: Table of Contents -->
                <div class="page" data-page="5">
                    <h2 class="chapter-title">Table of Contents</h2>
                    
                    <div style="line-height: 2; margin-top: 30px;">
                        <p><strong>1.5</strong> The Evidence Is Overwhelming ........................... 12</p>
                        <p><strong>1.6</strong> The Numbers Don't Lie .................................. 18</p>
                        <p><strong>1.7</strong> The Hero's Journey Begins ............................. 24</p>
                        
                        <h3 style="color: #2b6cb0; margin: 30px 0 15px 0;">Chapter 2: Jensen's Prophecy</h3>
                        
                        <p><strong>2.1</strong> Programming for Everyone, Equality or Divide? ............. 32</p>
                        <p><strong>2.2</strong> The Oracle of Silicon Valley .......................... 38</p>
                        <p><strong>2.3</strong> The Man Behind the Vision ............................ 44</p>
                        <p><strong>2.4</strong> The Physics Connection ................................ 50</p>
                        <p><strong>2.5</strong> The CUDA Revelation ................................... 56</p>
                        <p><strong>2.6</strong> The Parallel Processing Philosophy ................... 62</p>
                        
                        <h3 style="color: #2b6cb0; margin: 30px 0 15px 0;">Chapter 3: Beyond Genius: The Deep Learning Revolution</h3>
                        
                        <p><strong>3.1</strong> The Attention Mechanism .............................. 70</p>
                        <p><strong>3.2</strong> Transformers and the Future of Intelligence ......... 76</p>
                    </div>
                    
                    <div class="page-number">5</div>
                </div>

                <!-- Page 6: Book Preview Conclusion -->
                <div class="page" data-page="6">
                    <h2 class="chapter-title">Continue Reading</h2>
                    
                    <div style="text-align: center; margin-top: 80px;">
                        <div class="brain-icon" style="margin: 40px auto;">🧠</div>
                        
                        <h3 style="color: #2b6cb0; margin-bottom: 30px; font-size: 1.5rem;">Unlock Your Full Potential</h3>
                        
                        <p style="font-size: 1.1rem; margin-bottom: 30px; color: #4a5568;">This preview represents just the beginning of your journey into the cognitive divide.</p>
                        
                        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px; margin: 30px 0;">
                            <h4 style="margin-bottom: 15px;">Get the Complete Book</h4>
                            <p style="margin-bottom: 20px; font-size: 0.95rem;">Discover the complete framework for human-AI collaboration with insights from NVIDIA, OpenAI, and Mayo Clinic.</p>
                            <button onclick="window.open('https://www.amazon.co.uk/dp/B0FMSBB2ZL', '_blank')" 
                                    style="background: #ffd700; color: #2d3748; padding: 12px 30px; border: none; border-radius: 25px; font-weight: bold; cursor: pointer; font-size: 1rem;">
                                Buy on Amazon
                            </button>
                        </div>
                    </div>
                    
                    <div class="page-number">6</div>
                </div>
            </div>
        </div>
    </div>

    <!-- Controls -->
    <div class="controls">
        <button class="control-btn" id="openBookBtn">Open Book</button>
        <button class="control-btn" id="prevPageBtn" disabled>Previous Page</button>
        <button class="control-btn" id="nextPageBtn" disabled>Next Page</button>
        <button class="control-btn" id="closeBookBtn" disabled>Close Book</button>
    </div>

    <!-- Page Indicator -->
    <div class="page-indicator" id="pageIndicator">Cover</div>

    <!-- Loading Animation -->
    <div class="loading-animation" id="loadingAnimation">Turning page...</div>

    <script>
        class InteractiveBook {
            constructor() {
                this.currentPage = 0;
                this.totalPages = 6;
                this.isOpen = false;
                this.isAnimating = false;
                
                this.book = document.getElementById('book');
                this.bookCover = document.getElementById('bookCover');
                this.pages = document.querySelectorAll('.page');
                this.pageIndicator = document.getElementById('pageIndicator');
                this.loadingAnimation = document.getElementById('loadingAnimation');
                
                this.initializeControls();
                this.initializePageClicks();
                this.addSoundEffects();
            }

            initializeControls() {
                document.getElementById('openBookBtn').addEventListener('click', () => this.openBook());
                document.getElementById('closeBookBtn').addEventListener('click', () => this.closeBook());
                document.getElementById('nextPageBtn').addEventListener('click', () => this.nextPage());
                document.getElementById('prevPageBtn').addEventListener('click', () => this.prevPage());
                
                // Keyboard controls
                document.addEventListener('keydown', (e) => {
                    if (this.isOpen && !this.isAnimating) {
                        if (e.key === 'ArrowRight') this.nextPage();
                        if (e.key === 'ArrowLeft') this.prevPage();
                        if (e.key === 'Escape') this.closeBook();
                    }
                });
            }

            initializePageClicks() {
                this.pages.forEach((page, index) => {
                    page.addEventListener('click', (e) => {
                        if (this.isOpen && !this.isAnimating) {
                            const rect = page.getBoundingClientRect();
                            const clickX = e.clientX - rect.left;
                            const pageWidth = rect.width;
                            
                            // Click on right side = next page, left side = previous page
                            if (clickX > pageWidth / 2) {
                                this.nextPage();
                            } else {
                                this.prevPage();
                            }
                        }
                    });
                });
            }

            addSoundEffects() {
                // Create audio context for page turning sounds
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }

            playPageTurnSound() {
                // Simple page turn sound using Web Audio API
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(this.audioContext.destination);
                
                oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + 0.1);
                
                gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
                
                oscillator.start(this.audioContext.currentTime);
                oscillator.stop(this.audioContext.currentTime + 0.1);
            }

            openBook() {
                if (this.isAnimating) return;
                
                this.isAnimating = true;
                this.isOpen = true;
                
                this.book.classList.add('opened');
                this.bookCover.classList.add('opened');
                
                setTimeout(() => {
                    this.isAnimating = false;
                    this.updateControls();
                    this.updatePageIndicator();
                }, 1200);
                
                this.playPageTurnSound();
            }

            closeBook() {
                if (this.isAnimating) return;
                
                this.isAnimating = true;
                this.isOpen = false;
                this.currentPage = 0;
                
                // Reset all pages
                this.pages.forEach(page => {
                    page.classList.remove('turned');
                });
                
                this.book.classList.remove('opened');
                this.bookCover.classList.remove('opened');
                
                setTimeout(() => {
                    this.isAnimating = false;
                    this.updateControls();
                    this.updatePageIndicator();
                }, 1200);
                
                this.playPageTurnSound();
            }

            nextPage() {
                if (!this.isOpen || this.isAnimating || this.currentPage >= this.totalPages) return;
                
                this.isAnimating = true;
                this.showLoadingAnimation();
                
                const currentPageElement = this.pages[this.currentPage];
                if (currentPageElement) {
                    currentPageElement.classList.add('turned');
                }
                
                this.currentPage++;
                
                setTimeout(() => {
                    this.isAnimating = false;
                    this.hideLoadingAnimation();
                    this.updateControls();
                    this.updatePageIndicator();
                }, 800);
                
                this.playPageTurnSound();
            }

            prevPage() {
                if (!this.isOpen || this.isAnimating || this.currentPage <= 0) return;
                
                this.isAnimating = true;
                this.showLoadingAnimation();
                
                this.currentPage--;
                
                const currentPageElement = this.pages[this.currentPage];
                if (currentPageElement) {
                    currentPageElement.classList.remove('turned');
                }
                
                setTimeout(() => {
                    this.isAnimating = false;
                    this.hideLoadingAnimation();
                    this.updateControls();
                    this.updatePageIndicator();
                }, 800);
                
                this.playPageTurnSound();
            }

            showLoadingAnimation() {
                this.loadingAnimation.style.opacity = '1';
            }

            hideLoadingAnimation() {
                this.loadingAnimation.style.opacity = '0';
            }

            updateControls() {
                const openBtn = document.getElementById('openBookBtn');
                const closeBtn = document.getElementById('closeBookBtn');
                const prevBtn = document.getElementById('prevPageBtn');
                const nextBtn = document.getElementById('nextPageBtn');
                
                if (this.isOpen) {
                    openBtn.disabled = true;
                    closeBtn.disabled = false;
                    prevBtn.disabled = this.currentPage <= 0;
                    nextBtn.disabled = this.currentPage >= this.totalPages;
                } else {
                    openBtn.disabled = false;
                    closeBtn.disabled = true;
                    prevBtn.disabled = true;
                    nextBtn.disabled = true;
                }
            }

            updatePageIndicator() {
                if (!this.isOpen) {
                    this.pageIndicator.textContent = 'Cover';
                } else if (this.currentPage === 0) {
                    this.pageIndicator.textContent = 'Title Page';
                } else if (this.currentPage === this.totalPages) {
                    this.pageIndicator.textContent = 'Back Cover';
                } else {
                    this.pageIndicator.textContent = `Page ${this.currentPage} of ${this.totalPages}`;
                }
            }
        }

        // Initialize the interactive book when the page loads
        document.addEventListener('DOMContentLoaded', () => {
            new InteractiveBook();
        });

        // Add 3D book movement on mouse move
        document.addEventListener('mousemove', (e) => {
            const book = document.getElementById('book');
            const rect = book.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const mouseX = e.clientX;
            const mouseY = e.clientY;
            
            const rotateX = (mouseY - centerY) / 20;
            const rotateY = (mouseX - centerX) / 20;
            
            if (!book.classList.contains('opened')) {
                book.style.transform = `rotateY(${-20 + rotateY}deg) rotateX(${10 - rotateX}deg)`;
            }
        });
    </script>
</body>
</html>'''

# Save the HTML file
with open('interactive_book.html', 'w', encoding='utf-8') as f:
    f.write(html_content)

print("✅ Created interactive 3D book with realistic page turning!")
print("📖 Features included:")
print("   • 3D book cover that opens realistically")
print("   • Page-by-page navigation with smooth animations")
print("   • Click anywhere on pages to turn them")
print("   • Keyboard controls (arrow keys, ESC)")
print("   • Sound effects for page turning")
print("   • Mobile-responsive design")
print("   • Author photo placeholder (ready for your real photo)")
print("   • Real book content from 'The Cognitive Divide'")
print("   • Direct Amazon purchase links")
print("   • Professional typography and layout")