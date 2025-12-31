
// Main Application JavaScript
document.addEventListener('DOMContentLoaded', function () {
    // ============================================
    // GLOBAL VARIABLES AND CONSTANTS
    // ============================================
    const babySizes = [
        "Kwayoyin halitta", "Kankana", "Kankana", "Blueberry", "Blueberry",
        "Cherry", "Cherry", "Fig", "Fig", "Lime",
        "Lime", "Lemon", "Lemon", "Apple", "Apple",
        "Avocado", "Avocado", "Pear", "Pear", "Sweet Potato",
        "Sweet Potato", "Mango", "Mango", "Banana", "Banana",
        "Carrot", "Carrot", "Papaya", "Papaya", "Grapefruit",
        "Grapefruit", "Cantaloupe", "Cantaloupe", "Cauliflower", "Cauliflower",
        "Zucchini", "Zucchini", "Eggplant", "Eggplant", "Watermelon"
    ];

    const categoryNames = {
        'all': 'Duka Labarai',
        'pregnancy': 'Labaran Ciki',
        'baby-care': 'Kula da Jariri',
        'health': 'Lafiya',
        'nutrition': 'Abinci mai gina jiki',
        'postpartum': 'Bayan Haihuwa',
        'tips': 'Shawarwari',
        'symptoms': 'Alamun Ciki'
    };

    // Sample articles data
    const sampleArticles = [
        {
            id: 1,
            title: "Abinci Mai Gina Jiki Ga Uwa Mai Ciki",
            excerpt: "Menene abinci masu muhimmanci don lafiyar ku da ta jariri a lokacin ciki?",
            category: "nutrition",
            content: `<h2>Abinci Mai Gina Jiki Ga Uwa Mai Ciki</h2>
                <p>A lokacin ciki, cin abinci mai gina jiki yana da muhimmanci ga lafiyar ku da ta jariri.</p>`,
            readTime: "5 min",
            date: "15 Janairu 2024",
            icon: "🍎",
            saved: false
        },
        // Add more articles as needed
    ];

    // ============================================
    // UTILITY FUNCTIONS
    // ============================================
    function showToast(message, duration = 3000) {
        const toast = document.getElementById('error-toast');
        const messageEl = toast.querySelector('.toast-message');
        messageEl.textContent = message;

        toast.style.display = 'block';
        setTimeout(() => {
            toast.style.display = 'none';
        }, duration);
    }

    function formatDateHausa(date, format = 'short') {
        const options = format === 'long' ? {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        } : {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        };
        return date.toLocaleDateString('ha-NG', options);
    }

    function getDayDifference(date1, date2) {
        const diffTime = Math.abs(date2 - date1);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    // ============================================
    // THEME MANAGEMENT
    // ============================================
    function initTheme() {
        const themeToggle = document.getElementById('theme-toggle');
        const savedTheme = localStorage.getItem('theme') || 'light';

        if (savedTheme === 'dark') {
            document.body.classList.add('dark-mode');
        }

        themeToggle.addEventListener('click', function () {
            const isDark = document.body.classList.contains('dark-mode');
            document.body.classList.toggle('dark-mode');
            localStorage.setItem('theme', isDark ? 'light' : 'dark');
        });
    }

    // ============================================
    // FLIP CARD FUNCTIONALITY
    // ============================================
    function initFlipCards() {
        const flipCards = document.querySelectorAll('.flip-card');

        flipCards.forEach(card => {
            const front = card.querySelector('.card-front');
            const backBtn = card.querySelector('.back-btn');

            // Flip on card click
            front.addEventListener('click', function (e) {
                if (!e.target.closest('.back-btn')) {
                    card.classList.add('flipped');
                }
            });

            // Flip back on back button click
            if (backBtn) {
                backBtn.addEventListener('click', function (e) {
                    e.stopPropagation();
                    card.classList.remove('flipped');

                    // Special handling for articles card
                    if (card.id === 'articles-benefit-card') {
                        document.getElementById('articles-content-section').style.display = 'none';
                    }
                });
            }
        });
    }

    // ============================================
    // OVULATION CALCULATOR
    // ============================================
    function initOvulationCalculator() {
        const ovulationCard = document.getElementById('ovulation-benefit-card');
        const ovulationForm = document.getElementById('ovulation-form');
        const lmpInput = document.getElementById('lmp-date');
        const cycleSelect = document.getElementById('cycle-length');
        const modal = document.getElementById('ovulation-results-modal');
        const modalClose = modal?.querySelector('.modal-close');

        if (!ovulationForm || !modal) return;

        // Set default date (today - 14 days)
        if (lmpInput) {
            const today = new Date();
            const defaultDate = new Date(today);
            defaultDate.setDate(today.getDate() - 14);

            const year = defaultDate.getFullYear();
            const month = String(defaultDate.getMonth() + 1).padStart(2, '0');
            const day = String(defaultDate.getDate()).padStart(2, '0');

            lmpInput.value = `${year}-${month}-${day}`;
            lmpInput.max = new Date().toISOString().split('T')[0];
        }

        // Set default cycle length
        if (cycleSelect) {
            cycleSelect.value = '28';
        }

        // Form submission
        ovulationForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const lmpDate = new Date(lmpInput.value);
            const cycleLength = parseInt(cycleSelect.value);

            // Validate
            if (isNaN(lmpDate.getTime()) || lmpDate > new Date()) {
                showToast("Ranar da ka shigar ba ta da inganci");
                return;
            }

            if (cycleLength < 21 || cycleLength > 45) {
                showToast("Tsawon lokacin haila bai kamata ya kasance ƙasa da kwanaki 21 ko fiye da 45 ba");
                return;
            }

            // Calculate ovulation dates
            const ovulationDay = new Date(lmpDate);
            ovulationDay.setDate(ovulationDay.getDate() + (cycleLength - 14));

            const fertileStart = new Date(ovulationDay);
            fertileStart.setDate(fertileStart.getDate() - 3);

            const fertileEnd = new Date(ovulationDay);
            fertileEnd.setDate(fertileEnd.getDate() + 3);

            // Update modal
            document.getElementById('modal-ovulation-day').textContent =
                formatDateHausa(ovulationDay, 'short');

            document.getElementById('modal-fertile-window').textContent =
                `${formatDateHausa(fertileStart, 'short')} - ${formatDateHausa(fertileEnd, 'short')}`;

            document.getElementById('results-date-range').textContent =
                `Lissafi daga ${formatDateHausa(lmpDate, 'short')} zuwa ${formatDateHausa(ovulationDay, 'short')}`;

            // Show modal
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';

            // Flip card back
            ovulationCard.classList.remove('flipped');
        });

        // Modal close functionality
        if (modalClose) {
            modalClose.addEventListener('click', function () {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            });

            modal.querySelector('.modal-overlay').addEventListener('click', function () {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            });
        }

        // Save and share buttons
        document.getElementById('save-results-btn')?.addEventListener('click', function () {
            showToast("Sakamakon an ajiye shi cikin nasara!");
        });

        document.getElementById('share-results-btn')?.addEventListener('click', async function () {
            try {
                const shareData = {
                    title: 'Sakamakon Lissafin Ovulation',
                    text: `Daga Ciki da Raino App`,
                    url: window.location.href
                };

                if (navigator.share) {
                    await navigator.share(shareData);
                } else {
                    await navigator.clipboard.writeText("Sakamakon an kwafa shi zuwa clipboard!");
                    showToast("Sakamakon an kwafa shi zuwa clipboard!");
                }
            } catch (err) {
                showToast("Ba zai yiwu a raba sakamakon ba");
            }
        });
    }

    // ============================================
    // PREGNANCY TRACKER
    // ============================================
    function initPregnancyTracker() {
        const pregnancyForm = document.getElementById('pregnancy-form');
        const typeButtons = document.querySelectorAll('.type-btn');
        const lmpContainer = document.getElementById('lmp-input-container');
        const eddContainer = document.getElementById('edd-input-container');
        const lmpDateInput = document.getElementById('pregnancy-lmp-date');
        const eddDateInput = document.getElementById('pregnancy-edd-date');
        const modal = document.getElementById('pregnancy-results-modal');

        if (!pregnancyForm || !modal) return;

        let currentCalculationType = 'lmp';

        // Set calculation type - show only one input
        function setCalculationType(type) {
            currentCalculationType = type;

            // Update active button
            typeButtons.forEach(btn => {
                btn.classList.toggle('active', btn.dataset.type === type);
            });

            // Show/hide input containers
            if (type === 'lmp') {
                lmpContainer.classList.add('active');
                eddContainer.classList.remove('active');

                // Set required attributes
                lmpDateInput.required = true;
                eddDateInput.required = false;

                // Clear and focus on LMP input
                setTimeout(() => {
                    lmpDateInput.focus();
                }, 100);
            } else {
                lmpContainer.classList.remove('active');
                eddContainer.classList.add('active');

                // Set required attributes
                lmpDateInput.required = false;
                eddDateInput.required = true;

                // Clear and focus on EDD input
                setTimeout(() => {
                    eddDateInput.focus();
                }, 100);
            }

            // Clear the inactive input
            if (type === 'lmp') {
                eddDateInput.value = '';
            } else {
                lmpDateInput.value = '';
            }
        }

        // Type button event listeners
        typeButtons.forEach(btn => {
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                setCalculationType(this.dataset.type);
            });
        });

        // Set default dates
        function setDefaultDates() {
            const today = new Date();

            // Set max/min dates
            lmpDateInput.max = today.toISOString().split('T')[0];

            // For EDD, set min to today and max to 10 months from now
            eddDateInput.min = today.toISOString().split('T')[0];
            const maxDate = new Date(today);
            maxDate.setMonth(maxDate.getMonth() + 10);
            eddDateInput.max = maxDate.toISOString().split('T')[0];
        }

        // Validate date input
        function validateDate(input, isLMP = true) {
            const today = new Date();
            const selectedDate = new Date(input.value);

            if (isNaN(selectedDate.getTime())) {
                return { valid: false, error: "Ranar da ka shigar ba ta da inganci" };
            }

            if (isLMP) {
                // LMP cannot be in the future
                if (selectedDate > today) {
                    return { valid: false, error: "Ba zai yiwu ranar haila ta kasance a nan gaba ba" };
                }

                // LMP shouldn't be older than 1 year
                const oneYearAgo = new Date();
                oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

                if (selectedDate < oneYearAgo) {
                    return { valid: false, error: "Ranar haila ta wuce shekara guda. Da fatan za a shigar da wadda ta kusa" };
                }
            } else {
                // EDD should be in the future (can be up to 2 weeks overdue)
                const twoWeeksAgo = new Date();
                twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

                if (selectedDate < twoWeeksAgo) {
                    return { valid: false, error: "Ranar haihuwa ta wuce makonni biyu. Da fatan za a shigar da wadda ta dace" };
                }
            }

            return { valid: true, date: selectedDate };
        }

        // Calculate pregnancy from LMP
        function calculateFromLMP(lmpDate) {
            const today = new Date();
            const lmp = new Date(lmpDate);

            // Calculate EDD (LMP + 280 days)
            const edd = new Date(lmp);
            edd.setDate(edd.getDate() + 280);

            return calculatePregnancyDetails(lmp, edd, today);
        }

        // Calculate pregnancy from EDD
        function calculateFromEDD(eddDate) {
            const today = new Date();
            const edd = new Date(eddDate);

            // Calculate LMP (EDD - 280 days)
            const lmp = new Date(edd);
            lmp.setDate(lmp.getDate() - 280);

            return calculatePregnancyDetails(lmp, edd, today);
        }

        // Calculate pregnancy details
        function calculatePregnancyDetails(lmp, edd, today) {
            // Calculate days from LMP
            const diffTime = today - lmp;
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

            // Calculate weeks and days
            let weeks = Math.floor(diffDays / 7);
            const days = diffDays % 7;

            // Cap at 40 weeks
            if (weeks > 40) {
                weeks = 40;
            }

            // Calculate weeks left
            const dueDiffTime = edd - today;
            const dueDiffDays = Math.max(0, Math.floor(dueDiffTime / (1000 * 60 * 60 * 24)));
            const weeksLeft = Math.ceil(dueDiffDays / 7);

            // Calculate trimester
            let trimesterText;
            if (weeks <= 13) {
                trimesterText = "1 (Na Farko)";
            } else if (weeks <= 27) {
                trimesterText = "2 (Na Biyu)";
            } else {
                trimesterText = "3 (Na Uku)";
            }

            // Calculate month
            const month = Math.floor(weeks / 4.3) + 1;

            // Calculate progress
            const progress = Math.min(100, Math.round((weeks / 40) * 100));

            // Get baby size
            const babySize = babySizes[Math.min(weeks, 39)] || "Watermelon";

            return {
                lmp: lmp,
                edd: edd,
                weeks: weeks,
                days: days,
                weeksLeft: weeksLeft,
                daysLeft: dueDiffDays,
                trimesterText: trimesterText,
                month: month,
                progress: progress,
                babySize: babySize,
                daysFromLMP: diffDays
            };
        }

        // Form submission
        pregnancyForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Disable submit button temporarily
            const submitBtn = this.querySelector('.calculate-btn');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Ana lissafawa...';
            submitBtn.disabled = true;

            let validation;
            let results;

            if (currentCalculationType === 'lmp') {
                validation = validateDate(lmpDateInput, true);

                if (!validation.valid) {
                    showToast(validation.error);
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    return;
                }

                results = calculateFromLMP(lmpDateInput.value);
            } else {
                validation = validateDate(eddDateInput, false);

                if (!validation.valid) {
                    showToast(validation.error);
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    return;
                }

                results = calculateFromEDD(eddDateInput.value);
            }

            // Check if pregnancy is valid (not negative weeks)
            if (results.weeks < 0) {
                showToast("Ba zai yiwu ciki ya kasance kafin ranar haila ba");
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                return;
            }

            // Show results after delay
            setTimeout(() => {
                updatePregnancyModal(results);

                // Show modal
                modal.style.display = 'flex';
                document.body.style.overflow = 'hidden';

                // Flip card back
                document.getElementById('baby-tracking-card').classList.remove('flipped');

                // Reset button
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 500);
        });

        // Update pregnancy modal
        function updatePregnancyModal(results) {
            document.getElementById('current-week').textContent = results.weeks;
            document.getElementById('current-day').textContent = results.days;
            document.getElementById('baby-size-text').textContent = `Girman jariri: ${results.babySize}`;
            document.getElementById('due-date-text').textContent = formatDateHausa(results.edd);
            document.getElementById('weeks-left-text').textContent = `Saura makonni: ${results.weeksLeft}`;
            document.getElementById('week-display').textContent = `${results.weeks} (Ki ke a yanzu)`;
            document.getElementById('month-display').textContent = `${results.month} (Ki ke a yanzu)`;
            document.getElementById('trimester-display').textContent = results.trimesterText;

            // Update progress bar
            const progressBar = document.getElementById('pregnancy-progress');
            if (progressBar) {
                progressBar.style.width = `${results.progress}%`;

                // Color based on trimester
                if (results.weeks <= 13) {
                    progressBar.style.background = 'linear-gradient(90deg, #00aeef, #4dc9ff)';
                } else if (results.weeks <= 27) {
                    progressBar.style.background = 'linear-gradient(90deg, #fb923c, #fdba74)';
                } else {
                    progressBar.style.background = 'linear-gradient(90deg, #10b981, #34d399)';
                }
            }
        }

        // Modal close functionality
        const modalClose = modal.querySelector('.modal-close');
        const modalOverlay = modal.querySelector('.modal-overlay');

        function closeModal() {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }

        if (modalClose) {
            modalClose.addEventListener('click', closeModal);
            modalOverlay.addEventListener('click', closeModal);
        }

        // Save and share buttons
        document.getElementById('save-pregnancy-btn')?.addEventListener('click', function () {
            const pregnancyData = {
                calculationType: currentCalculationType,
                lmpDate: currentCalculationType === 'lmp' ? lmpDateInput.value : '',
                eddDate: currentCalculationType === 'edd' ? eddDateInput.value : '',
                calculatedAt: new Date().toISOString()
            };

            localStorage.setItem('pregnancy_tracking_data', JSON.stringify(pregnancyData));
            showToast("✓ Bayanin ciki an ajiye shi cikin nasara!", 3000);
        });

        document.getElementById('share-pregnancy-btn')?.addEventListener('click', async function () {
            try {
                const currentWeek = document.getElementById('current-week').textContent;
                const dueDate = document.getElementById('due-date-text').textContent;
                const weeksLeft = document.getElementById('weeks-left-text').textContent;

                const shareData = {
                    title: 'Sakamakon Bibiyar Ciki',
                    text: `Mako na: ${currentWeek}\nRanar Haihuwa: ${dueDate}\n${weeksLeft}\n\nDaga Ciki da Raino App`,
                    url: window.location.href
                };

                if (navigator.share && navigator.canShare(shareData)) {
                    await navigator.share(shareData);
                } else {
                    await navigator.clipboard.writeText(shareData.text);
                    showToast("✓ Sakamakon an kwafa shi zuwa clipboard!", 3000);
                }
            } catch (err) {
                showToast("Ba zai yiwu a raba sakamakon ba");
            }
        });

        // Initialize
        function initialize() {
            setCalculationType('lmp');
            setDefaultDates();

            // Load saved data
            const savedData = localStorage.getItem('pregnancy_tracking_data');
            if (savedData) {
                try {
                    const data = JSON.parse(savedData);
                    if (data.calculationType) {
                        setCalculationType(data.calculationType);
                    }
                    if (data.lmpDate && lmpDateInput) {
                        lmpDateInput.value = data.lmpDate;
                    }
                    if (data.eddDate && eddDateInput) {
                        eddDateInput.value = data.eddDate;
                    }
                } catch (e) {
                    console.error('Error loading saved pregnancy data:', e);
                }
            }
        }

        initialize();
    }

    // ============================================
    // ARTICLES SECTION
    // ============================================
    function initArticles() {
        const articlesCard = document.getElementById('articles-benefit-card');
        const articlesContentSection = document.getElementById('articles-content-section');
        const articlesGrid = document.getElementById('articles-grid');
        const categoryBtns = document.querySelectorAll('.category-btn');
        const searchInput = document.getElementById('articles-search');
        const searchBtn = document.querySelector('.search-btn');
        const articleDetailModal = document.getElementById('article-detail-modal');

        if (!articlesCard || !articlesContentSection) return;

        let currentCategory = 'all';
        let currentSearch = '';

        // Load articles
        function loadArticles() {
            // Show loading
            articlesGrid.innerHTML = '';
            document.getElementById('articles-loading').style.display = 'flex';

            // Simulate API delay
            setTimeout(() => {
                let filteredArticles = sampleArticles;

                // Filter by category
                if (currentCategory !== 'all') {
                    filteredArticles = filteredArticles.filter(article =>
                        article.category === currentCategory
                    );
                }

                // Filter by search
                if (currentSearch.trim() !== '') {
                    const searchTerm = currentSearch.toLowerCase();
                    filteredArticles = filteredArticles.filter(article =>
                        article.title.toLowerCase().includes(searchTerm) ||
                        article.excerpt.toLowerCase().includes(searchTerm)
                    );
                }

                // Update UI
                updateArticlesUI(filteredArticles);

                // Hide loading
                document.getElementById('articles-loading').style.display = 'none';
            }, 500);
        }

        // Update articles UI
        function updateArticlesUI(articles) {
            const count = articles.length;
            document.getElementById('articles-count').textContent = `${count} labar${count === 1 ? 'i' : 'ai'}`;
            document.getElementById('articles-category-title').textContent = categoryNames[currentCategory];

            // Clear grid
            articlesGrid.innerHTML = '';

            // Show no articles message if empty
            if (count === 0) {
                document.getElementById('no-articles-message').style.display = 'block';
                return;
            }

            // Hide no articles message
            document.getElementById('no-articles-message').style.display = 'none';

            // Add articles to grid
            articles.forEach(article => {
                const articleCard = createArticleCard(article);
                articlesGrid.appendChild(articleCard);
            });
        }

        // Create article card
        function createArticleCard(article) {
            const card = document.createElement('div');
            card.className = 'article-card';
            card.dataset.id = article.id;

            card.innerHTML = `
                <div class="article-image">
                    <span>${article.icon}</span>
                </div>
                <div class="article-content">
                    <span class="article-category">${categoryNames[article.category]}</span>
                    <h4 class="article-title">${article.title}</h4>
                    <p class="article-excerpt">${article.excerpt}</p>
                    <div class="article-meta">
                        <span class="article-date">
                            <span>📅</span>
                            <span>${article.date}</span>
                        </span>
                        <span class="article-read-time">
                            <span>⏱️</span>
                            <span>${article.readTime}</span>
                        </span>
                    </div>
                </div>
            `;

            card.addEventListener('click', () => {
                showArticleDetail(article);
            });

            return card;
        }

        // Show article detail
        function showArticleDetail(article) {
            if (!articleDetailModal) return;

            // Update modal content
            document.querySelector('.article-detail-title').textContent = article.title;
            document.querySelector('.article-category-badge').textContent = categoryNames[article.category];
            document.querySelector('.article-date').textContent = `📅 ${article.date}`;
            document.querySelector('.article-read-time').textContent = `⏱️ ${article.readTime}`;
            document.querySelector('.article-body').innerHTML = article.content;

            // Show modal
            articleDetailModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }

        // Close article detail
        function closeArticleDetail() {
            if (articleDetailModal) {
                articleDetailModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        }

        // Articles card click (show categories)
        articlesCard.querySelector('.card-front').addEventListener('click', function () {
            articlesCard.classList.add('flipped');
            articlesContentSection.style.display = 'block';
            loadArticles();
        });

        // Category selection
        categoryBtns.forEach(btn => {
            btn.addEventListener('click', function () {
                categoryBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                currentCategory = this.dataset.category;
                loadArticles();
            });
        });

        // Search functionality
        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                currentSearch = searchInput.value;
                loadArticles();
            });

            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    currentSearch = searchInput.value;
                    loadArticles();
                }
            });
        }

        // Article detail modal close
        document.querySelector('.article-back-btn')?.addEventListener('click', closeArticleDetail);
        articleDetailModal?.querySelector('.modal-overlay').addEventListener('click', closeArticleDetail);

        // Article action buttons
        document.querySelectorAll('.article-action-btn').forEach(btn => {
            btn.addEventListener('click', function () {
                const action = this.dataset.action;

                switch (action) {
                    case 'share':
                        showToast("Hanyar haɗin labari an kwafa shi");
                        break;
                    case 'save':
                        showToast("Labari an ajiye shi");
                        break;
                    case 'speak':
                        showToast("Ana karanta labarin...");
                        break;
                }
            });
        });
    }

    // ============================================
    // CHATBOT KNOWLEDGE BASE
    // ============================================
    const chatbotKnowledge = {
        // Pregnancy symptoms
        "alamun ciki": {
            question: "Menene alamun farko na ciki?",
            answer: `Alamun farko na ciki sun haɗa da:

1. **Jinkirin haila**: Mafi muhimmanci alama
2. **Ƙwayoyin nono masu zafi** ko girma
3. **Gajiya mai yawa** ba tare da dalili ba
4. **Ƙaiƙayi da amai** (morning sickness)
5. **Sauyin sha'awar abinci** (cravings)
6. **Motsin zuciya** (nausea)
7. **Yawan fitsari**
8. **Zazzabi ko zafi a jiki**

Alamun na iya bambanta daga mace zuwa mace. Idan kun ga waɗannan alamai, yi gwajin ciki.`,
            category: "ciki",
            tags: ["alamu", "farko", "symptoms"]
        },

        // Nutrition
        "abinci mai gina jiki": {
            question: "Menene abinci mai gina jiki ga uwa mai ciki?",
            answer: `Abinci mai gina jiki ga uwa mai ciki:

🍎 **'Ya'yan itatuwa da kayan lambu**: Rufe launi daban-daban (kore, ja, orange, purple)
🥚 **Furotin**: Kifi, nama, kwai, wake, soyayyen abinci
🥛 **Calcium**: Madara, cuku, yogurt, da kifi masu ƙashi
🌾 **Carbohydrates masu lafiya**: Shinkafa, alkama, masara, dawa
🥑 **Mai masu lafiya**: Avocado, man gyada, man zaitun
💧 **Ruwa**: A sha aƙalla lita 8-10 a rana

**Muhimman abubuwan gina jiki:**
• Folic acid (ganye kore, wake)
• Ƙarfe (nama, kifi, 'ya'yan itatuwa)
• Calcium (madara, cuku)
• Vitamin D (hasken rana, kifi)`,
            category: "abinci",
            tags: ["nutrition", "gina jiki", "abinci"]
        },

        // Water intake
        "ruwa a ciki": {
            question: "Yaya zan sha ruwa yayin ciki?",
            answer: `Yayin ciki, ruwa yana da muhimmanci sosai:

💧 **Yawan ruwa**: A sha aƙalla lita 8-10 a rana (ko fiye idan yana zafi)
🕒 **Lokaci**: Sha ƙarami akai-akai a tsawon rana
🚰 **Nau'in ruwa**: Ruwan sanyi ya fi dacewa, ruwan dafaffe ma yana da kyau
🍵 **Madadin**: Shan shayi mara caffeine, ruwan 'ya'yan itatuwa (lemun tsami, lemo)

**Fa'idodin ruwa yayin ciki:**
• Yana taimakawa haɓakar mahaifa
• Yana rage gajiya
• Yana hana constipation
• Yana kula da yawan ruwa a jiki
• Yana taimakawa cikin daukar sinadirai`,
            category: "lafiya",
            tags: ["ruwa", "hydration", "lafiya"]
        },

        // Labor signs
        "alamun haihuwa": {
            question: "Menene alamun haihuwa?",
            answer: `Alamun haihuwa sun haɗa da:

1. **Ragewar ciki**: Jariri ya sauka ƙasa
2. **Matsi a ƙashin ƙugu**: Ƙarfafa ciwo a bayanta
3. **Contractions**: Ciwo mai tafe a ciki (regular and getting closer)
4. **Ruwan daji**: Ruwa ya fashe (waters breaking)
5. **Show**: Zubar da jini mai ƙarfi
6. **Sauyin motsi**: Jariri ya rage motsi ko yana motsi sosai
7. **Nausea ko amai**
8. **Zazzabi mai ƙarfi**

**Lokacin tafiya asibiti:**
• Idan contractions suka kai kowane minti 5
• Idan ruwan daji ya fashe
• Idan akwai zubar jini mai yawa
• Idan jariri baya motsi ko yana motsi sosai`,
            category: "haihuwa",
            tags: ["labor", "delivery", "signs"]
        },

        // Baby care
        "kula da jariri": {
            question: "Yaya zan kula da jariri bayan haihuwa?",
            answer: `Kula da jariri bayan haihuwa:

👶 **Nonowa**: 
   • Nono na farko (colostrum) yana da mahimmanci
   • Ciyarwa akai-akai (kowace awa 2-3)
   • Tabbatar da jariri yana tsaye bayan ciyarwa

🛁 **Wanka**:
   • Yi wanka da ruwan dumi kawai har sai cibiya ta bushe
   • Amfani da sabulun jariri
   • Bayan wanka, shafa man jariri

😴 **Bacci**:
   • Jariri yana buƙatar bacci mai yawa (16-18 hours a day)
   • Kula da matsayin bacci (a bayansa ko gefensa)
   • Yi襁褓 don ƙarfafa bacci

🌡️ **Lafiya**:
   • Yi la'akari da zafin jiki
   • Duba saurin numfashi
   • Kula da alamar zazzabi

**Muhimmi**: Ku kasance masu haƙuri - jariri yana buƙatar lokaci don daidaitawa.`,
            category: "jariri",
            tags: ["baby care", "newborn", "parenting"]
        },

        // Pregnancy complications
        "cututtukan ciki": {
            question: "Menene cututtukan ciki?",
            answer: `Cututtukan ciki da za a kiyaye:

🤒 **Morning sickness** (ƙaiƙayi da amai):
   • Yana faruwa a farkon ciki
   • Shan ruwa da yawa, cin abinci ƙanƙan da ƙanƙan

💊 **Gestational diabetes**:
   • Canjin sukari a ciki
   • Kulawa ta hanyar abinci da motsa jiki

🩸 **High blood pressure** (preeclampsia):
   • Zubar jini mai yawa
   • Ciwo a kai
   • Ganin dumi a idanu

😴 **Gajiya mai yawa**:
   • Saboda canjin hormones
   • Yi hutawa da yawa

🤰 **Back pain**:
   • Saboda nauyin ciki
   • Yi motsa jiki mai sauƙi
   • Amfani da matashin baya

**Lokacin tuntubar likita:**
Idan kun ga wani bambancin da ba na al'ada ba, ku tafi asibiti nan da nan!`,
            category: "lafiya",
            tags: ["complications", "health", "risks"]
        },

        // Exercise
        "motsa jiki": {
            question: "Shin zan iya yi motsa jiki yayin ciki?",
            answer: `A'a, motsa jiki yana da amfani yayin ciki, amma da sharuɗɗa:

🚶 **Motsa jiki mai sauƙi**: 
   • Tafiya (30 minutes kullum)
   • Iyo
   • Yoga na ciki

⚠️ **Abubuwan da za a guje wa**:
   • Motsa jiki mai tsanani
   • Daukaka nauyi mai yawa
   • Wasanni masu haɗari
   • Kwantar da jiki a bayanka

**Fa'idodin motsa jiki yayin ciki:**
• Yana rage ciwon baya
• Yana inganta bacci
• Yana taimakawa haihuwa
• Yana rage damuwa
• Yana kula da nauyi

**Muhimmi**: Ku tuntubi likita kafin fara kowane motsa jiki.`,
            category: "lafiya",
            tags: ["exercise", "fitness", "health"]
        },

        // Default response
        "default": {
            question: "Na gane tambayar ku",
            answer: `Na gane tambayar ku. Duk da haka, ina ba ku shawarar tuntubar likita ko kwararre don amsa mafi inganci.

Za ku iya tambaya game da:
• Alamun ciki da lafiyar uwa
• Abinci mai gina jiki
• Shirye-shiryen haihuwa
• Kula da jariri
• Lafiyar bayan haihuwa
• Cututtukan ciki

Ku ci gaba da tambayar ku a cikin Hausa, zan iya taimaka muku da shawarwari na gabaɗaya.`,
            category: "general",
            tags: ["help", "general"]
        }
    };

    // ============================================
    // CHATBOT FUNCTIONALITY
    // ============================================
    function initChatbot() {
        // DOM Elements
        const chatbotPage = document.getElementById('chatbot-page');
        const chatBackBtn = document.getElementById('chat-back-btn');
        const messagesContainer = document.getElementById('messages-container');
        const chatInput = document.getElementById('chat-input');
        const sendBtn = document.getElementById('send-btn');
        const voiceBtn = document.getElementById('voice-btn');
        const clearChatBtn = document.getElementById('clear-chat-btn');
        const voiceListening = document.getElementById('voice-listening');
        const stopListeningBtn = document.getElementById('stop-listening-btn');
        const typingIndicator = document.getElementById('typing-indicator');
        const questionChips = document.querySelectorAll('.question-chip');
        const themeToggleChat = document.getElementById('theme-toggle-chat');

        // State
        let isListening = false;
        let chatHistory = [];

        // Initialize
        function initialize() {
            loadChatHistory();
            setupEventListeners();
            scrollToBottom();
        }

        // Load chat history from localStorage
        function loadChatHistory() {
            const savedChat = localStorage.getItem('chatbot_history');
            if (savedChat) {
                try {
                    chatHistory = JSON.parse(savedChat);
                    renderChatHistory();
                } catch (e) {
                    console.error('Error loading chat history:', e);
                    chatHistory = [];
                }
            }
        }

        // Save chat history to localStorage
        function saveChatHistory() {
            localStorage.setItem('chatbot_history', JSON.stringify(chatHistory));
        }

        // Render chat history
        function renderChatHistory() {
            messagesContainer.innerHTML = '';

            // Add welcome message if no history
            if (chatHistory.length === 0) {
                addBotMessage("Sannu! Ina taimakon Ciki da Raino. Zan iya amsa tambayoyin ku game da ciki, kula da jariri, lafiya, da dai sauransu a cikin Hausa. Me kuke bukata?", true);
                return;
            }

            // Render all messages from history
            chatHistory.forEach(msg => {
                if (msg.sender === 'user') {
                    addUserMessage(msg.text, msg.time, false);
                } else {
                    addBotMessage(msg.text, false, msg.time);
                }
            });

            scrollToBottom();
        }

        // Add user message
        function addUserMessage(text, time = null, saveToHistory = true) {
            const messageDiv = document.createElement('div');
            messageDiv.className = 'message user-message';

            const messageTime = time || getCurrentTime();

            messageDiv.innerHTML = `
            <div class="message-avatar">
                <span>👤</span>
            </div>
            <div class="message-content">
                <p>${escapeHtml(text)}</p>
                <div class="message-time">${messageTime}</div>
            </div>
        `;

            messagesContainer.appendChild(messageDiv);

            if (saveToHistory) {
                chatHistory.push({
                    sender: 'user',
                    text: text,
                    time: messageTime
                });
                saveChatHistory();
            }

            scrollToBottom();
            return messageDiv;
        }

        // Add bot message
        function addBotMessage(text, showTyping = true, time = null) {
            if (showTyping) {
                showTypingIndicator();
                setTimeout(() => {
                    hideTypingIndicator();
                    createBotMessage(text, time);
                }, 1500);
            } else {
                createBotMessage(text, time);
            }
        }

        // Create bot message element
        function createBotMessage(text, time = null) {
            const messageDiv = document.createElement('div');
            messageDiv.className = 'message bot-message';

            const messageTime = time || getCurrentTime();

            messageDiv.innerHTML = `
            <div class="message-avatar">
                <span>🤖</span>
            </div>
            <div class="message-content">
                <p>${formatMessageText(text)}</p>
                <div class="message-time">${messageTime}</div>
            </div>
        `;

            messagesContainer.appendChild(messageDiv);

            chatHistory.push({
                sender: 'bot',
                text: text,
                time: messageTime
            });
            saveChatHistory();

            scrollToBottom();
            return messageDiv;
        }

        // Format message text with line breaks
        function formatMessageText(text) {
            return escapeHtml(text).replace(/\n/g, '<br>');
        }

        // Escape HTML
        function escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }

        // Get current time
        function getCurrentTime() {
            const now = new Date();
            const hours = now.getHours().toString().padStart(2, '0');
            const minutes = now.getMinutes().toString().padStart(2, '0');
            return `${hours}:${minutes}`;
        }

        // Scroll to bottom of chat
        function scrollToBottom() {
            setTimeout(() => {
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }, 100);
        }

        // Show typing indicator
        function showTypingIndicator() {
            typingIndicator.style.display = 'flex';
            scrollToBottom();
        }

        // Hide typing indicator
        function hideTypingIndicator() {
            typingIndicator.style.display = 'none';
        }

        // Get bot response
        function getBotResponse(userMessage) {
            const lowerMessage = userMessage.toLowerCase().trim();

            // Check for exact matches
            for (const [key, data] of Object.entries(chatbotKnowledge)) {
                if (lowerMessage.includes(key.toLowerCase())) {
                    return {
                        text: data.answer,
                        category: data.category,
                        tags: data.tags
                    };
                }
            }

            // Check for keywords
            const keywordMap = {
                'ciki': chatbotKnowledge["alamun ciki"],
                'alamu': chatbotKnowledge["alamun ciki"],
                'abinci': chatbotKnowledge["abinci mai gina jiki"],
                'nutrition': chatbotKnowledge["abinci mai gina jiki"],
                'ruwa': chatbotKnowledge["ruwa a ciki"],
                'water': chatbotKnowledge["ruwa a ciki"],
                'haihuwa': chatbotKnowledge["alamun haihuwa"],
                'labor': chatbotKnowledge["alamun haihuwa"],
                'jariri': chatbotKnowledge["kula da jariri"],
                'baby': chatbotKnowledge["kula da jariri"],
                'cutar': chatbotKnowledge["cututtukan ciki"],
                'complication': chatbotKnowledge["cututtukan ciki"],
                'motsa jiki': chatbotKnowledge["motsa jiki"],
                'exercise': chatbotKnowledge["motsa jiki"],
                'fitness': chatbotKnowledge["motsa jiki"]
            };

            for (const [keyword, data] of Object.entries(keywordMap)) {
                if (lowerMessage.includes(keyword)) {
                    return {
                        text: data.answer,
                        category: data.category,
                        tags: data.tags
                    };
                }
            }

            // Default response
            return {
                text: chatbotKnowledge.default.answer,
                category: chatbotKnowledge.default.category,
                tags: chatbotKnowledge.default.tags
            };
        }

        // Handle user message
        function handleUserMessage(message) {
            if (!message.trim()) {
                showToast("Da fatan za a rubuta wani abu", 2000);
                return;
            }

            // Add user message
            addUserMessage(message);

            // Clear input
            chatInput.value = '';

            // Get and show bot response
            const response = getBotResponse(message);
            addBotMessage(response.text);

            // Show category toast
            const categoryNames = {
                'ciki': 'Alamun Ciki',
                'abinci': 'Abinci Mai Gina Jiki',
                'lafiya': 'Lafiya',
                'haihuwa': 'Haihuwa',
                'jariri': 'Kula da Jariri',
                'general': 'Gabaɗaya'
            };

            const categoryName = categoryNames[response.category] || response.category;
            showToast(`An ba da amsa game da ${categoryName}`, 2000);
        }

        // Voice input simulation
        function startVoiceInput() {
            if (isListening) return;

            isListening = true;
            voiceListening.style.display = 'block';
            voiceBtn.style.background = 'var(--accent-coral)';
            voiceBtn.style.color = 'white';

            // Simulate voice recognition
            setTimeout(() => {
                if (isListening) {
                    const sampleQuestions = [
                        "Menene alamun farko na ciki?",
                        "Menene abinci mai gina jiki ga uwa mai ciki?",
                        "Yaya zan sha ruwa yayin ciki?",
                        "Menene alamun haihuwa?",
                        "Yaya zan kula da jariri bayan haihuwa?",
                        "Shin zan iya yi motsa jiki yayin ciki?"
                    ];

                    const randomQuestion = sampleQuestions[Math.floor(Math.random() * sampleQuestions.length)];

                    // Add voice input
                    chatInput.value = randomQuestion;
                    handleUserMessage(randomQuestion);

                    // Stop listening
                    stopVoiceInput();
                }
            }, 3000);
        }

        // Stop voice input
        function stopVoiceInput() {
            isListening = false;
            voiceListening.style.display = 'none';
            voiceBtn.style.background = '';
            voiceBtn.style.color = '';
        }

        // Clear chat
        function clearChat() {
            if (chatHistory.length === 0) {
                showToast("Babu tattaunawar da za a share", 2000);
                return;
            }

            if (confirm("Kuna da tabbacin share duk tattaunawar?")) {
                chatHistory = [];
                saveChatHistory();
                renderChatHistory();
                showToast("An share tattaunawar", 2000);
            }
        }

        // Setup event listeners
        function setupEventListeners() {
            // Send message on button click
            sendBtn.addEventListener('click', () => {
                const message = chatInput.value.trim();
                handleUserMessage(message);
            });

            // Send message on Enter key
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    const message = chatInput.value.trim();
                    handleUserMessage(message);
                }
            });

            // Voice button
            voiceBtn.addEventListener('click', startVoiceInput);

            // Stop listening button
            stopListeningBtn.addEventListener('click', stopVoiceInput);

            // Clear chat button
            clearChatBtn.addEventListener('click', clearChat);

            // Quick question chips
            questionChips.forEach(chip => {
                chip.addEventListener('click', () => {
                    const question = chip.getAttribute('data-question');
                    chatInput.value = question;
                    handleUserMessage(question);
                });
            });

            // Theme toggle in chat
            if (themeToggleChat) {
                themeToggleChat.addEventListener('click', function () {
                    const isDark = document.body.classList.contains('dark-mode');
                    document.body.classList.toggle('dark-mode');
                    localStorage.setItem('theme', isDark ? 'light' : 'dark');
                    showToast(isDark ? "Yanayin haske" : "Yanayin duhu", 2000);
                });
            }
        }

        // Public methods for page switching
        return {
            show: function () {
                chatbotPage.style.display = 'flex';
                scrollToBottom();

                // Auto-focus on input
                setTimeout(() => {
                    chatInput.focus();
                }, 300);
            },

            hide: function () {
                chatbotPage.style.display = 'none';
            },

            initialize: initialize
        };
    }

    // Create chatbot instance
    const chatbot = initChatbot();

    // ============================================
    // PAGE NAVIGATION SYSTEM
    // ============================================
    function initPageNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        const mainContent = document.querySelector('.main-content');

        // Function to switch pages
        function switchPage(pageId) {
            // Update navigation
            navItems.forEach(item => {
                item.classList.remove('active');
                if (item.dataset.page === pageId) {
                    item.classList.add('active');
                }
            });

            // Handle page display
            if (pageId === 'chat') {
                mainContent.style.display = 'none';
                chatbot.show();
                document.body.style.overflow = 'hidden';
            } else {
                chatbot.hide();
                mainContent.style.display = 'block';
                document.body.style.overflow = 'auto';

                // Update URL for other pages if needed
                if (pageId === 'home') {
                    window.history.pushState({ page: 'home' }, '', '#');
                } else {
                    window.history.pushState({ page: pageId }, '', `#${pageId}`);
                }
            }
        }

        // Add click event to nav items
        navItems.forEach(item => {
            item.addEventListener('click', function (e) {
                e.preventDefault();
                const pageId = this.dataset.page;
                switchPage(pageId);
            });
        });

        // Handle back button in chat
        document.getElementById('chat-back-btn')?.addEventListener('click', () => {
            switchPage('home');
        });

        // Handle browser back/forward buttons
        window.addEventListener('popstate', function (event) {
            const hash = window.location.hash.substring(1) || 'home';
            switchPage(hash);
        });

        // Initialize page based on URL hash
        function initFromUrl() {
            const hash = window.location.hash.substring(1);
            if (hash && hash === 'chat') {
                switchPage('chat');
            } else {
                switchPage('home');
            }
        }

        // Initialize from URL
        initFromUrl();
    }

    // ============================================
    // INITIALIZE APP
    // ============================================
    function initApp() {
        initTheme();
        initFlipCards();
        initOvulationCalculator();
        initPregnancyTracker();
        initArticles();
        chatbot.initialize(); // Initialize chatbot first
        initPageNavigation(); // Then initialize navigation

        // Close modals with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                document.querySelectorAll('.calculator-modal, .article-modal').forEach(modal => {
                    modal.style.display = 'none';
                    document.body.style.overflow = 'auto';
                });
            }
        });
    }

    // Start the app
    initApp();
});
