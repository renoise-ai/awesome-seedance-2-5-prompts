import type { Locale } from "./i18n";

export interface FaqItem {
  question: string;
  answer: string;
}

const faqData: Record<Locale, FaqItem[]> = {
  en: [
    {
      question: "What is Seedance 2.5 and why should I use it?",
      answer:
        "Seedance 2.5 is ByteDance's state-of-the-art AI video generation model. It produces cinematic 1080p videos up to 8 seconds with advanced physics simulation, multi-character consistency, and in-video text rendering. On Renoise, you can use Seedance 2.5 with one click — just copy a prompt from this gallery, paste it, and generate your video instantly.",
    },
    {
      question: "How do I use these prompts with Renoise?",
      answer:
        'Click "Copy Prompt" on any card — the text copies to your clipboard and Renoise opens automatically. Just paste (⌘V / Ctrl+V) into the prompt box, select Seedance 2.5, and hit generate. No setup needed. Renoise handles all the infrastructure so you can focus on creating.',
    },
    {
      question: "What's the difference between Seedance 2.5 and Nanobanana 2 (Gemini 3.1 Flash)?",
      answer:
        "Seedance 2.5 and Nanobanana 2 (powered by Gemini 3.1 Flash) target different creative workflows. Seedance 2.5 specializes in AI video generation — producing 8-second cinematic clips with physics simulation, camera movements, and multi-subject consistency. Nanobanana 2 focuses on AI image generation with Google's latest Gemini 3.1 Flash model, excelling at high-quality stills with fast inference. Think of it as: Seedance 2.5 for motion, Nanobanana 2 for stills. Renoise supports both, so you can generate images with Nanobanana 2 and bring them to life with Seedance 2.5's image-to-video feature.",
    },
    {
      question: "How does Seedance 2.5 compare to Kling, Runway, and Sora?",
      answer:
        "Seedance 2.5 uses a hybrid DiT-UNet architecture with flow matching, delivering faster inference than diffusion-only models. Compared to Kling 2.0, it offers stronger physics simulation and text-in-video capabilities. Vs. Runway Gen-3 Alpha, Seedance 2.5 provides native 1080p output without upscaling. Vs. Sora, it's publicly accessible today with consistent multi-subject handling. All these models are evolving rapidly — this gallery lets you test real Seedance 2.5 prompts with actual video results so you can judge quality yourself.",
    },
    {
      question: "What makes a great Seedance 2.5 prompt?",
      answer:
        "The best prompts follow a structure: scene setting → camera movement → subject details → physics/lighting. For example: \"Cinematic wide shot, slow dolly forward, a samurai standing in a field of tall grass, wind bending the grass and flowing through his cloak, golden hour backlight with lens flare.\" Keep it under 200 words. Mentioning specific physics (cloth draping, fluid dynamics, particle effects) unlocks Seedance 2.5's strongest capabilities.",
    },
    {
      question: "How often is this collection updated?",
      answer:
        "Daily. We curate prompts from creators worldwide, verify video output quality, and add translations in 5 languages. New trending styles and techniques (like character animation, style transfer, and multi-scene storytelling) are prioritized. Follow our GitHub repo for real-time updates.",
    },
    {
      question: "Is this free to use?",
      answer:
        "Yes — browsing, searching, and copying every prompt in this gallery is 100% free with no account required. To generate videos, Renoise offers free credits to get started, with Pro and Ultra plans for heavy usage. The prompts here work with any platform that supports Seedance 2.5.",
    },
  ],
  "zh-CN": [
    {
      question: "Seedance 2.5 是什么？为什么要用它？",
      answer:
        "Seedance 2.5 是字节跳动最先进的 AI 视频生成模型，可生成长达 8 秒的 1080p 电影级视频，支持高级物理模拟、多角色一致性和视频内文字渲染。在 Renoise 上，你可以一键使用 Seedance 2.5 —— 从本库复制提示词，粘贴即可生成视频。",
    },
    {
      question: "怎么配合 Renoise 使用这些提示词？",
      answer:
        "点击任意卡片的「复制提示词」—— 文本会复制到剪贴板，同时自动打开 Renoise。粘贴（⌘V / Ctrl+V）到提示框，选择 Seedance 2.5 模型，点击生成即可。无需任何配置，Renoise 处理所有基础设施。",
    },
    {
      question: "Seedance 2.5 和 Nanobanana 2（Gemini 3.1 Flash）有什么区别？",
      answer:
        "Seedance 2.5 和 Nanobanana 2（基于 Google Gemini 3.1 Flash）面向不同的创作场景。Seedance 2.5 专注 AI 视频生成 —— 生成 8 秒电影级片段，支持物理模拟、镜头运动和多主体一致性。Nanobanana 2 则专注 AI 图像生成，利用 Gemini 3.1 Flash 实现高质量静态图的快速推理。简单说：动态用 Seedance 2.5，静态用 Nanobanana 2。Renoise 两者都支持，你可以用 Nanobanana 2 生成图片，再用 Seedance 2.5 的「图生视频」功能让画面动起来。",
    },
    {
      question: "Seedance 2.5 和 Kling、Runway、Sora 相比怎么样？",
      answer:
        "Seedance 2.5 采用混合 DiT-UNet 架构和流匹配技术，推理速度比纯 Diffusion 模型更快。与可灵 2.0 相比，物理模拟和文字渲染更强。与 Runway Gen-3 Alpha 相比，原生 1080p 输出无需超分。与 Sora 相比，现在就能公开使用且多主体处理更稳定。各模型都在快速进化 —— 本库让你用真实提示词和实际视频效果自行判断质量。",
    },
    {
      question: "怎么写出优秀的 Seedance 2.5 提示词？",
      answer:
        "最佳提示词遵循这个结构：场景设定 → 镜头运动 → 主体细节 → 物理/光照。例如：「电影级广角镜头，缓慢推轨前进，一位武士站在高草丛中，风吹弯草丛并掀动他的斗篷，黄金时刻逆光带镜头光晕」。控制在 200 字以内效果最佳。提及具体的物理效果（布料垂坠、流体动力学、粒子特效）能发挥 Seedance 2.5 的最强能力。",
    },
    {
      question: "这个合集多久更新一次？",
      answer:
        "每日更新。我们从全球创作者社区筛选提示词，验证视频输出质量，并提供 5 种语言翻译。角色动画、风格迁移、多场景叙事等新兴技术会优先收录。关注我们的 GitHub 仓库获取实时更新。",
    },
    {
      question: "免费吗？",
      answer:
        "是的 —— 浏览、搜索和复制本库所有提示词完全免费，无需注册。生成视频方面，Renoise 提供免费额度供新用户体验，重度用户可升级 Pro 或 Ultra 套餐。这些提示词适用于任何支持 Seedance 2.5 的平台。",
    },
  ],
  ja: [
    {
      question: "Seedance 2.5とは？なぜ使うべき？",
      answer:
        "Seedance 2.5はByteDanceの最先端AI動画生成モデルです。ネイティブ1080pで最大8秒のシネマティック動画を生成し、高度な物理シミュレーション、マルチキャラクター一貫性、動画内テキストレンダリングをサポートしています。Renoiseでは、このギャラリーからプロンプトをコピーして貼り付けるだけで、ワンクリックでSeedance 2.5を使用できます。",
    },
    {
      question: "Renoiseでこれらのプロンプトを使うには？",
      answer:
        "カードの「プロンプトをコピー」をクリック — テキストがクリップボードにコピーされ、Renoiseが自動的に開きます。プロンプトボックスに貼り付け（⌘V / Ctrl+V）、Seedance 2.5を選択して生成するだけ。セットアップ不要です。",
    },
    {
      question: "Seedance 2.5とNanobanana 2（Gemini 3.1 Flash）の違いは？",
      answer:
        "Seedance 2.5とNanobanana 2（Google Gemini 3.1 Flash搭載）は異なるクリエイティブワークフローを対象としています。Seedance 2.5はAI動画生成に特化し、物理シミュレーション、カメラムーブメント、マルチサブジェクト一貫性を備えた8秒のシネマティッククリップを生成します。Nanobanana 2はAI画像生成に焦点を当て、高速推論で高品質なスチルを生成します。動きならSeedance 2.5、スチルならNanobanana 2。Renoiseは両方をサポートしており、Nanobanana 2で画像を生成し、Seedance 2.5の画像→動画機能で命を吹き込むことができます。",
    },
    {
      question: "Seedance 2.5はKling、Runway、Soraと比べてどう？",
      answer:
        "Seedance 2.5はハイブリッドDiT-UNetアーキテクチャとフローマッチングを採用し、拡散のみのモデルより高速な推論を実現。Kling 2.0と比べて物理シミュレーションとテキストイン動画が優れ、Runway Gen-3 Alphaと比べてアップスケーリング不要のネイティブ1080p出力、Soraと比べて現在一般公開されマルチサブジェクト処理が安定。このギャラリーで実際のプロンプトと動画結果を確認して、ご自身で品質を判断できます。",
    },
    {
      question: "優れたSeedance 2.5プロンプトの書き方は？",
      answer:
        "最良のプロンプトは、シーン設定 → カメラムーブメント → 被写体の詳細 → 物理/ライティングの構造に従います。例：「シネマティックワイドショット、ゆっくりドリーフォワード、高い草原に立つ侍、風が草をなびかせマントを翻す、ゴールデンアワーの逆光とレンズフレア」。200語以内が最適。布のドレープ、流体力学、パーティクルエフェクトなどの具体的な物理を記述すると効果的です。",
    },
    {
      question: "このコレクションはどのくらいの頻度で更新？",
      answer:
        "毎日更新。世界中のクリエイターからプロンプトをキュレーションし、動画出力品質を検証し、5言語に翻訳しています。キャラクターアニメーション、スタイル転送、マルチシーンストーリーテリングなどのトレンド技術を優先して収録しています。",
    },
    {
      question: "無料ですか？",
      answer:
        "はい — このギャラリーのすべてのプロンプトの閲覧、検索、コピーはアカウント不要で100%無料です。動画生成にはRenoiseの無料クレジットで始められ、ヘビーユーザー向けにProとUltraプランがあります。ここのプロンプトはSeedance 2.5をサポートするどのプラットフォームでも使えます。",
    },
  ],
  "pt-BR": [
    {
      question: "O que é o Seedance 2.5 e por que devo usá-lo?",
      answer:
        "O Seedance 2.5 é o modelo de geração de vídeo com IA mais avançado da ByteDance. Produz vídeos cinematográficos em 1080p de até 8 segundos com simulação física avançada, consistência entre múltiplos personagens e renderização de texto no vídeo. No Renoise, você pode usar o Seedance 2.5 com um clique — copie um prompt desta galeria, cole e gere seu vídeo instantaneamente.",
    },
    {
      question: "Como usar estes prompts com o Renoise?",
      answer:
        'Clique em "Copiar Prompt" em qualquer cartão — o texto é copiado e o Renoise abre automaticamente. Basta colar (⌘V / Ctrl+V) na caixa de prompt, selecionar Seedance 2.5 e gerar. Sem configuração necessária.',
    },
    {
      question: "Qual a diferença entre Seedance 2.5 e Nanobanana 2 (Gemini 3.1 Flash)?",
      answer:
        "Seedance 2.5 e Nanobanana 2 (com Gemini 3.1 Flash do Google) atendem fluxos criativos diferentes. Seedance 2.5 é especializado em geração de vídeo com IA — produzindo clipes cinematográficos de 8 segundos com simulação física e consistência multi-sujeito. Nanobanana 2 foca em geração de imagem com IA, com inferência rápida e alta qualidade. Resumindo: Seedance 2.5 para movimento, Nanobanana 2 para imagens estáticas. O Renoise suporta ambos — gere imagens com Nanobanana 2 e dê vida a elas com o recurso de imagem-para-vídeo do Seedance 2.5.",
    },
    {
      question: "Como o Seedance 2.5 se compara ao Kling, Runway e Sora?",
      answer:
        "O Seedance 2.5 usa arquitetura híbrida DiT-UNet com flow matching, entregando inferência mais rápida que modelos somente de difusão. Comparado ao Kling 2.0, oferece simulação física e texto em vídeo superiores. Vs. Runway Gen-3 Alpha, saída nativa 1080p sem upscaling. Vs. Sora, está publicamente acessível hoje com tratamento consistente de múltiplos sujeitos. Esta galeria permite testar prompts reais do Seedance 2.5 com resultados em vídeo para julgar a qualidade por si mesmo.",
    },
    {
      question: "O que faz um ótimo prompt para Seedance 2.5?",
      answer:
        "Os melhores prompts seguem uma estrutura: cenário → movimento de câmera → detalhes do sujeito → física/iluminação. Exemplo: \"Plano geral cinematográfico, dolly lento para frente, um samurai em um campo de grama alta, vento dobrando a grama e fluindo pelo manto, luz dourada com flare de lente.\" Mantenha abaixo de 200 palavras. Mencionar física específica (caimento de tecido, dinâmica de fluidos, efeitos de partículas) desbloqueia as capacidades mais fortes do Seedance 2.5.",
    },
    {
      question: "Com que frequência esta coleção é atualizada?",
      answer:
        "Diariamente. Curamos prompts de criadores do mundo todo, verificamos a qualidade do vídeo gerado e adicionamos traduções em 5 idiomas. Novos estilos e técnicas em alta (como animação de personagens, transferência de estilo e narrativa multi-cena) são priorizados.",
    },
    {
      question: "É gratuito?",
      answer:
        "Sim — navegar, buscar e copiar todos os prompts desta galeria é 100% gratuito, sem necessidade de conta. Para gerar vídeos, o Renoise oferece créditos gratuitos para começar, com planos Pro e Ultra para uso intenso. Os prompts aqui funcionam com qualquer plataforma que suporte o Seedance 2.5.",
    },
  ],
  es: [
    {
      question: "¿Qué es Seedance 2.5 y por qué debería usarlo?",
      answer:
        "Seedance 2.5 es el modelo de generación de video con IA más avanzado de ByteDance. Produce videos cinematográficos en 1080p de hasta 8 segundos con simulación física avanzada, consistencia entre múltiples personajes y renderizado de texto en video. En Renoise, puedes usar Seedance 2.5 con un clic — copia un prompt de esta galería, pégalo y genera tu video al instante.",
    },
    {
      question: "¿Cómo uso estos prompts con Renoise?",
      answer:
        'Haz clic en "Copiar Prompt" en cualquier tarjeta — el texto se copia y Renoise se abre automáticamente. Solo pega (⌘V / Ctrl+V) en el campo de prompt, selecciona Seedance 2.5 y genera. Sin configuración necesaria.',
    },
    {
      question: "¿Cuál es la diferencia entre Seedance 2.5 y Nanobanana 2 (Gemini 3.1 Flash)?",
      answer:
        "Seedance 2.5 y Nanobanana 2 (con Gemini 3.1 Flash de Google) apuntan a flujos creativos diferentes. Seedance 2.5 se especializa en generación de video con IA — produciendo clips cinematográficos de 8 segundos con simulación física y consistencia multi-sujeto. Nanobanana 2 se enfoca en generación de imagen con IA, con inferencia rápida y alta calidad. En resumen: Seedance 2.5 para movimiento, Nanobanana 2 para imágenes estáticas. Renoise soporta ambos — genera imágenes con Nanobanana 2 y dales vida con la función de imagen-a-video de Seedance 2.5.",
    },
    {
      question: "¿Cómo se compara Seedance 2.5 con Kling, Runway y Sora?",
      answer:
        "Seedance 2.5 usa una arquitectura híbrida DiT-UNet con flow matching, ofreciendo inferencia más rápida que los modelos solo de difusión. Comparado con Kling 2.0, ofrece simulación física y texto en video superiores. Vs. Runway Gen-3 Alpha, salida nativa 1080p sin upscaling. Vs. Sora, está públicamente accesible hoy con manejo consistente de múltiples sujetos. Esta galería te permite probar prompts reales de Seedance 2.5 con resultados en video para juzgar la calidad por ti mismo.",
    },
    {
      question: "¿Qué hace un gran prompt para Seedance 2.5?",
      answer:
        "Los mejores prompts siguen una estructura: escenario → movimiento de cámara → detalles del sujeto → física/iluminación. Ejemplo: \"Plano general cinematográfico, dolly lento hacia adelante, un samurái en un campo de hierba alta, viento doblando la hierba y ondeando su capa, luz dorada con destello de lente.\" Mantén menos de 200 palabras. Mencionar física específica (caída de tela, dinámica de fluidos, efectos de partículas) desbloquea las capacidades más fuertes de Seedance 2.5.",
    },
    {
      question: "¿Con qué frecuencia se actualiza esta colección?",
      answer:
        "Diariamente. Curamos prompts de creadores de todo el mundo, verificamos la calidad del video generado y añadimos traducciones en 5 idiomas. Los nuevos estilos y técnicas en tendencia (como animación de personajes, transferencia de estilo y narrativa multi-escena) se priorizan.",
    },
    {
      question: "¿Es gratis?",
      answer:
        "Sí — navegar, buscar y copiar todos los prompts de esta galería es 100% gratis sin necesidad de cuenta. Para generar videos, Renoise ofrece créditos gratuitos para comenzar, con planes Pro y Ultra para uso intenso. Los prompts aquí funcionan con cualquier plataforma que soporte Seedance 2.5.",
    },
  ],
};

export function getFaq(locale: Locale): FaqItem[] {
  return faqData[locale] ?? faqData.en;
}

export function getFaqEnglish(): FaqItem[] {
  return faqData.en;
}
