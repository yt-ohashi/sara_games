document.addEventListener("DOMContentLoaded", function () {
  // ページ内の要素を徐々に表示するアニメーション
  const elements = document.querySelectorAll(
    ".section-title, .intro, .skills-container, .pet-container, .message-bubble"
  );

  elements.forEach((element, index) => {
    element.style.opacity = "0";
    element.style.transform = "translateY(20px)";
    element.style.transition = "opacity 0.5s ease, transform 0.5s ease";

    setTimeout(() => {
      element.style.opacity = "1";
      element.style.transform = "translateY(0)";
    }, 300 * (index + 1));
  });

  // スキルホバーエフェクトの強化
  const skills = document.querySelectorAll(".skill");
  skills.forEach((skill) => {
    skill.addEventListener("mouseover", function () {
      skills.forEach((s) => {
        if (s !== skill) {
          s.style.opacity = "0.6";
        }
      });
    });

    skill.addEventListener("mouseout", function () {
      skills.forEach((s) => {
        s.style.opacity = "1";
      });
    });
  });

  // タイピングアニメーション
  const introTextElement = document.querySelector(".intro p:first-child");
  if (introTextElement) {
    const text = introTextElement.textContent;
    introTextElement.textContent = "";

    let i = 0;
    const typeWriter = () => {
      if (i < text.length) {
        introTextElement.textContent += text.charAt(i);
        i++;
        setTimeout(typeWriter, 30);
      }
    };

    setTimeout(typeWriter, 1500);
  }

  // ミルクの不規則な動き
  const walkAnimation = document.querySelector(".walk-animation");
  if (walkAnimation) {
    // ランダムな時間間隔でミルクを歩かせる
    function walkMilk() {
      const delay = Math.random() * 20000 + 5000; // 5〜25秒の間隔

      setTimeout(() => {
        walkAnimation.style.animation = "none";
        setTimeout(() => {
          walkAnimation.style.animation = "walkAnimation 15s ease-in-out";
          walkMilk();
        }, 10);
      }, delay);
    }

    walkMilk();
  }

  // 紗良の表情差分切り替え
  const saraImage = document.getElementById("sara-image");
  if (saraImage) {
    // プロフィールヘッダーの直後に表情選択UI追加
    const profileHeader = document.querySelector(".profile-header");
    const moodSelector = document.createElement("div");
    moodSelector.className = "mood-selector";

    // 表情の種類
    const moods = [
      { name: "normal", label: "普通" },
      { name: "hehe", label: "嬉しい" },
      { name: "surprise", label: "驚き" },
      { name: "shy", label: "照れ" },
      { name: "angry", label: "怒り" },
      { name: "cry", label: "泣き" },
    ];

    // 表情選択ドットを作成
    moods.forEach((mood, index) => {
      const dot = document.createElement("div");
      dot.className = "mood-dot";
      dot.title = mood.label;
      dot.dataset.mood = mood.name;
      if (index === 0) dot.classList.add("active");

      dot.addEventListener("click", function () {
        // 現在のアクティブ状態をリセット
        document
          .querySelectorAll(".mood-dot")
          .forEach((d) => d.classList.remove("active"));
        this.classList.add("active");

        // 画像を切り替え
        saraImage.src = `image/sara_${mood.name}.png`;

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

          messageElement.innerHTML = messages[mood.name];
        }
      });

      moodSelector.appendChild(dot);
    });

    // DOMに追加
    profileHeader.parentNode.insertBefore(
      moodSelector,
      profileHeader.nextSibling
    );
  }

  // YouTubeチャンネル関連のアニメーション
  const youtubeContainer = document.querySelector(".youtube-container");
  if (youtubeContainer) {
    // YouTubeアイコンのパルスアニメーション
    const youtubeIcon = document.querySelector(".youtube-icon");
    if (youtubeIcon) {
      youtubeIcon.style.animation = "pulseAnimation 2s ease-in-out infinite";
    }
  }

  // ダークモード切り替えボタン
  const footer = document.querySelector("footer .container");
  const darkModeToggle = document.createElement("button");
  darkModeToggle.textContent = "🌙 ダークモード切替";
  darkModeToggle.classList.add("dark-mode-toggle");
  darkModeToggle.style.background = "rgba(255, 255, 255, 0.2)";
  darkModeToggle.style.border = "none";
  darkModeToggle.style.borderRadius = "20px";
  darkModeToggle.style.padding = "8px 16px";
  darkModeToggle.style.margin = "10px 0 0";
  darkModeToggle.style.cursor = "pointer";
  darkModeToggle.style.color = "white";
  darkModeToggle.style.fontFamily = "inherit";
  darkModeToggle.style.transition = "all 0.3s ease";

  darkModeToggle.addEventListener("mouseover", function () {
    this.style.background = "rgba(255, 255, 255, 0.3)";
  });

  darkModeToggle.addEventListener("mouseout", function () {
    this.style.background = "rgba(255, 255, 255, 0.2)";
  });

  darkModeToggle.addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
      document.body.style.backgroundColor = "#1a202c";
      document.body.style.color = "#e2e8f0";
      document.querySelectorAll(".profile").forEach((el) => {
        el.style.backgroundColor = "#2d3748";
      });
      document.querySelectorAll(".profile-details p").forEach((el) => {
        el.style.color = "#a0aec0";
      });
      document.querySelectorAll(".intro, .message-bubble").forEach((el) => {
        el.style.backgroundColor = "#2d3748";
      });
      document.querySelectorAll(".message-bubble::before").forEach((el) => {
        el.style.backgroundColor = "#2d3748";
      });
      document.querySelectorAll(".skill").forEach((el) => {
        el.style.backgroundColor = "#4a5568";
        el.style.color = "#d6bcfa";
      });
      document.querySelectorAll(".pet-container").forEach((el) => {
        el.style.backgroundColor = "#2d3748";
      });
      this.textContent = "☀️ ライトモード切替";
    } else {
      document.body.style.backgroundColor = "";
      document.body.style.color = "";
      document.querySelectorAll(".profile").forEach((el) => {
        el.style.backgroundColor = "";
      });
      document.querySelectorAll(".profile-details p").forEach((el) => {
        el.style.color = "";
      });
      document.querySelectorAll(".intro, .message-bubble").forEach((el) => {
        el.style.backgroundColor = "";
      });
      document.querySelectorAll(".message-bubble::before").forEach((el) => {
        el.style.backgroundColor = "";
      });
      document.querySelectorAll(".skill").forEach((el) => {
        el.style.backgroundColor = "";
        el.style.color = "";
      });
      document.querySelectorAll(".pet-container").forEach((el) => {
        el.style.backgroundColor = "";
      });
      this.textContent = "🌙 ダークモード切替";
    }
  });

  footer.appendChild(darkModeToggle);
});
