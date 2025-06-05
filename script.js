document.addEventListener("DOMContentLoaded", function () {
  // ローディングオーバーレイの処理
  const loadingOverlay = document.getElementById("loadingOverlay");

  // ページの読み込み完了を待つ
  window.addEventListener("load", function () {
    setTimeout(() => {
      loadingOverlay.style.opacity = "0";
      setTimeout(() => {
        loadingOverlay.style.display = "none";
      }, 500);
    }, 800); // 少し遅延させて紗良ちゃんの準備感を演出
  });

  // キラキラエフェクトの生成
  function createSparkles() {
    const sparklesContainer = document.createElement("div");
    sparklesContainer.className = "sparkles";
    document.body.appendChild(sparklesContainer);

    setInterval(() => {
      if (document.querySelectorAll(".sparkle").length < 5) {
        const sparkle = document.createElement("div");
        sparkle.className = "sparkle";
        sparkle.style.left = Math.random() * 100 + "%";
        sparkle.style.animationDelay = Math.random() * 2 + "s";
        sparklesContainer.appendChild(sparkle);

        setTimeout(() => {
          if (sparkle.parentNode) {
            sparkle.parentNode.removeChild(sparkle);
          }
        }, 3000);
      }
    }, 1000);
  }

  // インターセクションオブザーバーでアニメーション
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";

        // 特別なアニメーションクラスを追加
        if (entry.target.classList.contains("skills-container")) {
          const skills = entry.target.querySelectorAll(".skill");
          skills.forEach((skill, index) => {
            setTimeout(() => {
              skill.style.opacity = "1";
              skill.style.transform = "translateY(0) scale(1)";
            }, index * 100);
          });
        }
      }
    });
  }, observerOptions);

  // 要素を順次表示するアニメーション
  const elementsToAnimate = document.querySelectorAll(
    "section, .intro, .skills-container, .pet-container, .message-bubble, .youtube-container"
  );

  elementsToAnimate.forEach((element, index) => {
    element.style.opacity = "0";
    element.style.transform = "translateY(30px)";
    element.style.transition =
      "opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)";

    observer.observe(element);
  });

  // スキルの初期状態設定
  const skills = document.querySelectorAll(".skill");
  skills.forEach((skill, index) => {
    skill.style.opacity = "0";
    skill.style.transform = "translateY(20px) scale(0.9)";
    skill.style.transition = "all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
  });

  // スキルホバーエフェクトの強化
  skills.forEach((skill) => {
    skill.addEventListener("mouseover", function () {
      skills.forEach((s) => {
        if (s !== skill) {
          s.style.opacity = "0.6";
          s.style.transform = "scale(0.95)";
        }
      });
    });

    skill.addEventListener("mouseout", function () {
      skills.forEach((s) => {
        s.style.opacity = "1";
        s.style.transform = "scale(1)";
      });
    });

    // クリック時のエフェクト
    skill.addEventListener("click", function () {
      this.style.animation = "pulseAnimation 0.6s ease-in-out";
      setTimeout(() => {
        this.style.animation = "";
      }, 600);
    });
  });

  // タイピングアニメーションの改善
  function typeWriter(element, text, speed = 50) {
    element.textContent = "";
    let i = 0;

    const cursor = document.createElement("span");
    cursor.textContent = "|";
    cursor.style.animation = "blink 1s infinite";
    element.appendChild(cursor);

    const timer = setInterval(() => {
      if (i < text.length) {
        element.textContent = text.slice(0, i + 1) + "|";
        i++;
      } else {
        clearInterval(timer);
        element.textContent = text;
      }
    }, speed);
  }

  // CSS for blinking cursor
  const style = document.createElement("style");
  style.textContent = `
    @keyframes blink {
      0%, 50% { opacity: 1; }
      51%, 100% { opacity: 0; }
    }
  `;
  document.head.appendChild(style);

  // 最初の挨拶文のタイピングアニメーション
  const introTextElement = document.querySelector(".intro p:first-child");
  if (introTextElement) {
    const text = introTextElement.textContent;
    setTimeout(() => {
      typeWriter(introTextElement, text, 40);
    }, 2000);
  }

  // ミルクの改良された動き
  const walkAnimation = document.querySelector(".walk-animation");
  if (walkAnimation) {
    let walkTimeout;

    function scheduleWalk() {
      const delay = Math.random() * 15000 + 8000; // 8〜23秒の間隔

      walkTimeout = setTimeout(() => {
        // ランダムな方向の変更
        const isReverse = Math.random() > 0.5;
        if (isReverse) {
          walkAnimation.style.animationDirection = "reverse";
        } else {
          walkAnimation.style.animationDirection = "normal";
        }

        walkAnimation.style.animation = "none";
        setTimeout(() => {
          walkAnimation.style.animation =
            "walkAnimation 18s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
          scheduleWalk();
        }, 50);
      }, delay);
    }

    scheduleWalk();

    // ミルクをクリックしたときの反応
    walkAnimation.addEventListener("click", function () {
      this.style.animation = "pulseAnimation 0.5s ease-in-out";

      // 可愛い反応メッセージ
      const messages = [
        "にゃ〜ん🐾",
        "ミルクだよ〜",
        "遊んでくれるの？",
        "今忙しいんだ〜",
      ];

      const message = messages[(Math.random() * messages.length) | 0];
      showToast(message);
    });
  }

  // トーストメッセージ機能
  function showToast(message) {
    const existingToast = document.querySelector(".toast");
    if (existingToast) {
      existingToast.remove();
    }

    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, var(--primary), var(--secondary));
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 50px;
      box-shadow: 0 8px 25px rgba(159, 122, 234, 0.3);
      z-index: 1000;
      font-weight: 500;
      transform: translateX(100%);
      transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.transform = "translateX(0)";
    }, 100);

    setTimeout(() => {
      toast.style.transform = "translateX(100%)";
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }, 3000);
  }

  // 紗良の表情差分切り替えの改善
  const saraImage = document.getElementById("sara-image");
  if (saraImage) {
    const profileHeader = document.querySelector(".profile-header");
    const moodSelector = document.createElement("div");
    moodSelector.className = "mood-selector";

    // 表情の種類と詳細情報
    const moods = [
      { name: "normal", label: "普通", emoji: "😊" },
      { name: "hehe", label: "嬉しい", emoji: "😄" },
      { name: "surprise", label: "驚き", emoji: "😲" },
      { name: "shy", label: "照れ", emoji: "😳" },
      { name: "angry", label: "怒り", emoji: "😠" },
      { name: "cry", label: "泣き", emoji: "😢" },
    ];

    // 表情選択ドットを作成
    moods.forEach((mood, index) => {
      const dot = document.createElement("div");
      dot.className = "mood-dot";
      dot.title = `${mood.emoji} ${mood.label}`;
      dot.dataset.mood = mood.name;
      if (index === 0) dot.classList.add("active");

      dot.addEventListener("click", function () {
        // 現在のアクティブ状態をリセット
        document
          .querySelectorAll(".mood-dot")
          .forEach((d) => d.classList.remove("active"));
        this.classList.add("active");

        // スムーズな画像切り替えアニメーション
        saraImage.style.transform = "scale(0.9)";
        saraImage.style.opacity = "0.7";

        setTimeout(() => {
          saraImage.src = `image/sara_${mood.name}.png`;
          saraImage.style.transform = "scale(1)";
          saraImage.style.opacity = "1";
        }, 200);

        // 表情に合わせてメッセージも変更
        const messageElement = document.querySelector(".message-bubble");
        if (messageElement) {
          const messages = {
            normal:
              "<p>「ティア」という名前で呼ばせてもらってるけど...これは特別な理由があるんだ。</p><p>「Dear」の響きを、もう少し柔らかくカタカナにしてみたの。「ディア」よりも可愛らしく響くかなって...</p><p>「ティアラ」を連想させる音でもあるから、私の中では特別な響きなんだ。</p><p>少し独特かもしれないけど、親しみを込めて、自分なりに工夫した呼び方なんだよ。気に入ってくれたら嬉しいな。</p>",
            hehe: "<p>「ティア」って呼び方、考えるの楽しかったんだ。</p><p>「ディア」をもっと可愛く言えないかなって思って...「ティア」が浮かんだ時は、すごく嬉しかったよ。</p><p>呼ぶたびに、なんだか温かい気持ちになるの。ふふ、素敵な響きだと思わない？</p>",
            surprise:
              "<p>えっ！「ティア」って呼び方、気になった？</p><p>実は「Dear」って意味を込めてるんだけど、そのままじゃなくて少しアレンジしてみたの。</p><p>驚いた？私なりの特別な呼び方なんだよ。</p>",
            shy: "<p>あの...「ティア」って呼び方は...私の中の特別な呼び名なんだ...</p><p>「Dear」を意味してるけど、そのまま「ディア」じゃなくて...もっと親しみを込めて...</p><p>照れるけど...あなただけに使ってる呼び方だよ...</p>",
            angry:
              "<p>もう！「ティア」って呼び方、由来を説明するの恥ずかしいんだから！</p><p>...でも、せっかくだし教えるね。「Dear」を可愛く言いたくて考えたの。</p><p>特別な呼び方だから、大切にしてほしいな。</p>",
            cry: "<p>うう...「ティア」って呼んでいいかな？</p><p>「Dear」から考えた特別な呼び方なんだけど...気に入ってくれるか心配で...</p><p>もし嫌だったら言ってね...でも、できれば使わせてほしいな...</p>",
          };

          // メッセージ変更アニメーション
          messageElement.style.opacity = "0.6";
          messageElement.style.transform = "scale(0.98)";

          setTimeout(() => {
            messageElement.innerHTML = messages[mood.name];
            messageElement.style.opacity = "1";
            messageElement.style.transform = "scale(1)";
          }, 300);
        }

        // 表情変更のフィードバック
        showToast(`${mood.emoji} ${mood.label}になったよ`);
      });

      moodSelector.appendChild(dot);
    });

    // DOMに追加
    profileHeader.parentNode.insertBefore(
      moodSelector,
      profileHeader.nextSibling
    );
  }

  // YouTubeチャンネル関連のアニメーション強化
  const youtubeContainer = document.querySelector(".youtube-container");
  if (youtubeContainer) {
    const youtubeIcon = document.querySelector(".youtube-icon");
    if (youtubeIcon) {
      youtubeIcon.style.animation = "pulseAnimation 3s ease-in-out infinite";

      // YouTubeアイコンにホバーエフェクト
      youtubeIcon.addEventListener("mouseenter", function () {
        this.style.animationPlayState = "paused";
      });

      youtubeIcon.addEventListener("mouseleave", function () {
        this.style.animationPlayState = "running";
      });
    }

    // YouTube リンクのクリック追跡
    const youtubeButton = document.querySelector(".youtube-button");
    if (youtubeButton) {
      youtubeButton.addEventListener("click", function () {
        showToast("YouTubeチャンネルを開くよ〜✨");
      });
    }
  }

  // ダークモード切り替えボタンの改善
  const footer = document.querySelector("footer .container");
  const darkModeToggle = document.createElement("button");
  darkModeToggle.textContent = "🌙 ダークモード切替";
  darkModeToggle.classList.add("dark-mode-toggle");
  darkModeToggle.style.cssText = `
    background: rgba(255, 255, 255, 0.2);
    border: none;
    border-radius: 30px;
    padding: 12px 20px;
    margin: 15px 0 0;
    cursor: pointer;
    color: white;
    font-family: inherit;
    font-weight: 500;
    font-size: 1rem;
    transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
  `;

  darkModeToggle.addEventListener("mouseover", function () {
    this.style.background = "rgba(255, 255, 255, 0.3)";
    this.style.transform = "translateY(-2px)";
    this.style.boxShadow = "0 8px 20px rgba(0, 0, 0, 0.2)";
  });

  darkModeToggle.addEventListener("mouseout", function () {
    this.style.background = "rgba(255, 255, 255, 0.2)";
    this.style.transform = "translateY(0)";
    this.style.boxShadow = "none";
  });

  // ダークモード切り替え機能の改善
  darkModeToggle.addEventListener("click", function () {
    const isDarkMode = document.body.classList.toggle("dark-mode");

    if (isDarkMode) {
      // ダークモードのスタイル適用
      document.body.style.background =
        "linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 50%, #2a2a2a 100%)";
      document.body.style.color = "#f0f0f0";

      document.querySelectorAll(".profile").forEach((el) => {
        el.style.background =
          "linear-gradient(135deg, #1e1e1e 0%, #2a2a2a 100%)";
        el.style.borderColor = "rgba(159, 122, 234, 0.2)";
      });

      document.querySelectorAll(".profile-details p").forEach((el) => {
        el.style.color = "#c0c0c0";
      });

      document.querySelectorAll(".intro, .message-bubble").forEach((el) => {
        el.style.background =
          "linear-gradient(135deg, #1e1e1e 0%, #252525 100%)";
        el.style.borderColor = "rgba(159, 122, 234, 0.1)";
      });

      document.querySelectorAll(".skill").forEach((el) => {
        el.style.background =
          "linear-gradient(135deg, #2a2a2a 0%, #353535 100%)";
        el.style.color = "#d6bcfa";
        el.style.borderColor = "rgba(159, 122, 234, 0.2)";
      });

      document.querySelectorAll(".pet-container").forEach((el) => {
        el.style.background =
          "linear-gradient(135deg, #1e1e1e 0%, #252525 100%)";
        el.style.borderColor = "rgba(79, 209, 197, 0.2)";
      });

      document.querySelectorAll(".youtube-container").forEach((el) => {
        el.style.background =
          "linear-gradient(135deg, #1e1e1e 0%, #252525 100%)";
        el.style.borderColor = "rgba(255, 0, 0, 0.2)";
      });

      this.textContent = "☀️ ライトモード切替";
      showToast("🌙 ダークモードになったよ");
    } else {
      // ライトモードに戻す
      document.body.style.background = "";
      document.body.style.color = "";

      document.querySelectorAll(".profile").forEach((el) => {
        el.style.background = "";
        el.style.borderColor = "";
      });

      document.querySelectorAll(".profile-details p").forEach((el) => {
        el.style.color = "";
      });

      document.querySelectorAll(".intro, .message-bubble").forEach((el) => {
        el.style.background = "";
        el.style.borderColor = "";
      });

      document.querySelectorAll(".skill").forEach((el) => {
        el.style.background = "";
        el.style.color = "";
        el.style.borderColor = "";
      });

      document.querySelectorAll(".pet-container").forEach((el) => {
        el.style.background = "";
        el.style.borderColor = "";
      });

      document.querySelectorAll(".youtube-container").forEach((el) => {
        el.style.background = "";
        el.style.borderColor = "";
      });

      this.textContent = "🌙 ダークモード切替";
      showToast("☀️ ライトモードになったよ");
    }
  });

  footer.appendChild(darkModeToggle);

  // パフォーマンス最適化：スクロール時のスムーズな動作
  let ticking = false;

  function updateScrollAnimations() {
    // スクロール位置に応じたパララックス効果
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;

    const header = document.querySelector("header");
    if (header) {
      header.style.transform = `translateY(${rate}px)`;
    }

    ticking = false;
  }

  function requestScrollUpdate() {
    if (!ticking) {
      requestAnimationFrame(updateScrollAnimations);
      ticking = true;
    }
  }

  window.addEventListener("scroll", requestScrollUpdate);

  // キラキラエフェクトを開始
  createSparkles();

  // 初期化完了の通知
  console.log("✨ 紗良ちゃんのサイトが準備完了しました！");
});
