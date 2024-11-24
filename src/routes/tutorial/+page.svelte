<script>
    import { onMount } from "svelte";

    import Header from "$lib/Header.svelte";
    import FDFDooter from "$lib/Footer.svelte";

    onMount(() => {
        const handleKeydown = (event) => {
            // Check if any modifier key is pressed
            if (
                event.metaKey ||
                event.ctrlKey ||
                event.altKey ||
                event.shiftKey
            ) {
                return; // Exit the function if a modifier key is pressed
            }

            const key = event.key;
            let detailsElement;

            switch (key) {
                case "1":
                    detailsElement = document.querySelector(
                        "details:nth-of-type(1)",
                    );
                    break;
                case "2":
                    detailsElement = document.querySelector(
                        "details:nth-of-type(2)",
                    );
                    break;
                case "3":
                    detailsElement = document.querySelector(
                        "details:nth-of-type(3)",
                    );
                    break;
                case "4":
                    detailsElement = document.querySelector(
                        "details:nth-of-type(4)",
                    );
                    break;
            }

            if (detailsElement) {
                detailsElement.open = !detailsElement.open;
            }
        };

        document.addEventListener("keydown", handleKeydown);

        return () => {
            document.removeEventListener("keydown", handleKeydown);
        };
    });
</script>

<svelte:head>
    <title>Zotero Reading List</title>
    <meta
        name="description"
        content="Display of Zotero group items and collections"
    />
</svelte:head>

<body class="relative">
    <div
        class="-z-10 fixed top-0"
        style="left: 0px; right: 0px; height: 960px; opacity: 0.6; background: linear-gradient(to bottom, #FFECB3, transparent);"
    ></div>

    <Header />

    <article class="prose prose-sm px-2 pb-8 mx-auto text-black">
        <h2>Getting Started Tutorial</h2>
        <h3>Main steps</h3>
        <p>
            First, go download <a href="https://www.zotero.org/">Zotero</a> and sign
            up for an account. Confirm your email. Log onto the desktop app. Download
            the Zotero Connector extension.
        </p>

        <p>
            Next, create a new Zotero group and get the Group ID. It should look
            something like <kbd>5263957</kbd>. The group has to be public,
            otherwise the public API doesn't expose it. In theory, this project
            can also work on individual collections, but I haven't done the API
            changes needed.
        </p>

        <p>
            Now put the group ID after the URL on this page. <kbd
                >tomato.com</kbd
            >
            becomes
            <kbd>tomato.com/5263957</kbd>.
        </p>

        <h3>Integrating Zotero into your workflow</h3>

        <p>
            Sci-hub and libgen are great for students and young professionals as
            they promote the freedom of information to those who are cash-poor.
            If this is you, search for what you need and drop it into Zotero.
        </p>

        <p>
            Whenever I come across something interesting, I save it into my
            Chrome Reading List until I have the time to file it into Zotero
            using the Chrome extension.
        </p>

        <h3>Theory on categorization</h3>

        <p>
            Categorization and enumerating (listing out everything like 1, 2, 3)
            is a fundamental aspect of human organization. URLs are like a file
            system. We group organisms into different taxa.
        </p>

        <p>
            The issues in categorization arise when there is sparseness (not
            enough items to create categories) and when something can belong to
            multiple categories.
        </p>
        <p>
            Luckily, Zotero categories are not mutually exclusive: just put your
            item into multiple collections. And for sparseness, just collect a
            bunch of articles you like until you start seeing underlying
            patterns that make sense to sort them with. Using ChatGPT to create
            categorizations for you doesn't work well because it can't fully
            simulate your understanding of an article. I think you have to do it
            manually as there is currently little replacement for human insight.
        </p>

        <p>
            Being able to see both the individual and the category is important.
            In reality and nature, things exist along a gradient. Graph-based
            thinking as popularized by Obsidian is also useful for creating
            inductive principles from many examples or backtracing a thought
            process.
        </p>
    </article>

    <FDFDooter />
</body>
