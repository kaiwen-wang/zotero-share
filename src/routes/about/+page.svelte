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
        class="-z-10 fixed top-0 left-0 right-0 bottom-0"
        style="opacity: 0.6; background: linear-gradient(to bottom, #FFECB3, transparent);"
    ></div>

    <Header />

    <article class="prose prose-sm px-2 pb-8 mx-auto text-black">
        <h2>About</h2>
        <h3>Why did I build this?</h3>
        <p>
            I use Zotero to manage all the books I read. This solution pulls my
            Group Library from the <a
                href="https://www.zotero.org/support/dev/web_api/v3/start"
                >Zotero API</a
            >
            and displays all the Collections and Items in a navigable way. The
            <a href="https://www.zotero.org/groups/5263957/books_pdfs/library"
                >default web viewer</a
            > is difficult for people to quickly scroll through or navigate.
        </p>

        <p>
            I needed a way to share my content, but I didn't like the idea of
            posting reviews on Goodreads, sticking everything in a Notion
            database, or manually curating things on my personal website. It
            seemed too roundabout. Hence, I was pleasantly enthused to discover
            Zotero's API capabilities.
        </p>

        <h3>Inspired By</h3>

        <ul>
            <li>
                <a
                    href="https://robertreads.notion.site/d1aa189b12e547799c3a5954b289cb5d?v=c344d511453b46eebace4671761ae631"
                    >Robert's Book Reviews</a
                >
            </li>
            <li>
                <a href="https://lawrencewu.com/"> https://lawrencewu.com/</a>
            </li>
            <li>
                <a href="https://curius.app/"> Curius</a>
            </li>
            <li>
                <a href="https://www.are.na/"> Arena</a>
            </li>
            <li>
                <a href="https://www.coolthingsifoundontheinternet.com/brian"
                    >coolthingsifoundontheinternet.com</a
                >
            </li>
            <li>
                <a href="https://macwright.com/reading/"
                    >https://macwright.com/reading/</a
                >
            </li>
        </ul>

        <p>
            These authors also shared their own reading content or shared the
            books that they read. I stumbled upon such links just browsing the
            internet, and I think they have greatly contributed to the
            liveliness and quality of discourse.
        </p>

        <p>
            I'm considering curating a list of people's "recently found
            articles" and book reviews. Contact me if you have something to
            share!
        </p>

        <h3>Why use Zotero to manage .epubs?</h3>

        <p>
            I've used most of the reading tools available: Google Play Books,
            Apple Books, Kindle Books, Calibre, storing everything on the file
            system, and most of them had some sort of significant disadvantage.
        </p>

        <details>
            <summary
                >Pros/Cons of Google Play Books <kbd>Press 1 to Toggle</kbd
                ></summary
            >
            <div class="border border-black leading-none my-2 px-4 py-3">
                <p class="my-0">Pros:</p>
                <ul class="mt-2 mb-4">
                    <li class="">
                        Syncs all highlights to Google Docs, allowing for easy
                        searching and exporting.
                    </li>
                    <li class="mb-0">
                        Works on Android (but not Huawei Matepad Paper)
                    </li>
                </ul>
                <p class="my-0">Cons:</p>
                <ul class="mt-2 mb-0">
                    <li class="my-0">
                        Cloud, so stops working if you don't have internet or
                        servers go down
                    </li>
                    <li class="mb-[0.2rem]">Doesn't highlight PDFs</li>
                </ul>
            </div>
        </details>

        <details>
            <summary
                >Pros/Cons of Apple Books <kbd>Press 2 to Toggle</kbd></summary
            >
            <div class="border border-black leading-none my-2 px-4 py-3">
                <p class="my-0">Pros:</p>
                <ul class="mt-2 mb-4">
                    <li class="mb-0">Highlights PDFs</li>
                </ul>
                <p class="my-0">Cons:</p>
                <ul class="mt-2 mb-0">
                    <li class="mb-[0.2rem]">
                        Annoying "This book is protected by copyright" when
                        trying to copy-paste
                    </li>
                </ul>
            </div>
        </details>

        <details>
            <summary>Cons of Kindle Books <kbd>Press 3 to Toggle</kbd></summary>
            <div class="border border-black leading-none my-2 px-4 py-3">
                <p class="my-0">Cons:</p>
                <ul class="mt-2 mb-0">
                    <li class="my-0">
                        .mobi file format, and you have to email things to your
                        Kindle or some roundabout method to get it loaded on.
                    </li>
                    <li class="mb-[0.2rem]">
                        UI is not as good as Apple Books or Google Play Books
                    </li>
                </ul>
            </div>
        </details>

        <details>
            <summary>Cons of Calibre <kbd>Press 4 to Toggle</kbd></summary>
            <div class="border border-black leading-none my-2 px-4 py-3">
                <p class="my-0">Cons:</p>
                <ul class="mt-2 mb-0">
                    <li class="my-0">
                        UI is barely usable as an e-book manager
                    </li>
                    <li class="mb-[0.2rem]">Huge app size</li>
                </ul>
            </div>
        </details>

        <p>
            With the release of .epub support for Zotero and an Android app for
            those tablet-like eReaders, I'm confident that Zotero is the best
            choice for managing all your reading content. Metadata retrieval and
            easy citations are a bonus on top.
        </p>

        <p>
            Unfortunately, it's not possibile to have this site directly link to
            the book source stored on Zotero servers (there are limitations on
            public group attachment sharing, probably due to bandwidth or
            piracy). But I will link to Libgen, Archive.org, or Goodreads if
            appropriate.
        </p>

        <h3>Future Roadmap</h3>

        <p>
            I'm mostly done with this project, outside of curating and updating
            my list of books and links. I'm looking at a few bug fixes and
            caching for sharing webpage snapshots.
        </p>

        <p>
            I may look into creating an RSS feed or email list of things every
            week.
        </p>

        <p>
            It'll remain a free project unless there is significant demand for a
            paid version or it becomes unwieldy to offer for free. The
            difficulty with adoption is that Zotero itself must be adopted as
            one's primary reading system, and said person must want to share
            their curated lists with others.
        </p>

        <p>If you do end up using this, feel free to let me know.</p>

        <h3>Credits</h3>
        <ul>
            <li>Zotero</li>
            <li>Zotero Web API</li>
            <li>zotero-api-client</li>
            <li>Open Library Book Covers API</li>
            <li>Radix Icons</li>
            <li>Claude</li>
            <li>Modern Font Stacks</li>
            <li>Svelte</li>
            <li>Tailwind CSS</li>
        </ul>
    </article>

    <FDFDooter />
</body>
