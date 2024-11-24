<script>
    export let item;
    export let loading = false;
    export let viewMode = "grid";

    function getAuthors(item) {
        if (item.creators && item.creators.length > 0) {
            return item.creators
                .filter((creator) => creator.creatorType === "author")
                .map((author) => {
                    if (author.name) {
                        return author.name;
                    } else if (author.firstName && author.lastName) {
                        return `${author.firstName} ${author.lastName}`;
                    } else if (author.lastName) {
                        return author.lastName;
                    } else {
                        return "Unknown";
                    }
                })
                .join(", ");
        }
        return "Author not specified";
    }

    async function getCoverUrl(item) {
        // First check if we already have a cached coverUrl
        if (item.data?.coverUrl) {
            try {
                const cache = await caches.open("zotero-images");
                const response = await cache.match(item.data.coverUrl);
                if (response) {
                    return item.data.coverUrl;
                }
            } catch (error) {
                console.error("Error checking image cache:", error);
            }
        }

        // If no cached URL or cache miss, generate new URL
        let url = null;
        if (item.ISBN) {
            url = `https://covers.openlibrary.org/b/isbn/${item.ISBN.split(" ")[0]}-M.jpg`;
        } else if (item.DOI) {
            url = `https://covers.openlibrary.org/b/doi/${item.DOI}-M.jpg`;
        } else if (item.ISSN) {
            url = `https://covers.openlibrary.org/b/issn/${item.ISSN}-M.jpg`;
        }

        if (url) {
            try {
                // Try to fetch and cache the image
                const cache = await caches.open("zotero-images");
                const response = await fetch(url);
                if (response.ok) {
                    await cache.put(url, response.clone());
                    // Store the URL in the item data for future use
                    if (item.data) {
                        item.data.coverUrl = url;
                    } else {
                        item.data = { coverUrl: url };
                    }
                    return url;
                }
            } catch (error) {
                console.error("Error caching image:", error);
            }
        }

        return null;
    }

    let coverUrlPromise;
    $: {
        if (!loading) {
            coverUrlPromise = getCoverUrl(item);
        }
    }

    export let dialog;

    function openDialog(event) {
        if (!loading) {
            dialog.showModal();
        }
    }

    function closeDialog(event) {
        if (event.target === dialog) {
            dialog.close();
        }
    }

    function handleKeydown(event) {
        if (event.key === "Escape") {
            console.log("Escape key pressed");
            // Add your desired action here
        }
    }

    function handleImageError(event) {
        event.target.style.display = "none";
        event.target.nextElementSibling.style.display = "block";
    }
</script>

<dialog
    bind:this={dialog}
    on:click={closeDialog}
    on:keydown={handleKeydown}
    role="presentation"
    class="focus:outline-none"
>
    <div class="flex border-black border">
        <div
            class="w-64 h-96 border-r border-black flex items-center justify-center"
        >
            {#if loading}
                <div class="w-full h-full bg-gray-200 animate-pulse"></div>
            {:else}
                {#await coverUrlPromise}
                    <div class="w-full h-full bg-gray-200 animate-pulse"></div>
                {:then coverUrl}
                    {#if coverUrl}
                        <img
                            src={coverUrl}
                            alt={item.title}
                            class="w-full h-full"
                            on:error={handleImageError}
                        />
                        <span class="text-gray-400 text-xs hidden"
                            >No cover available</span
                        >
                    {:else}
                        <span class="text-gray-400 text-xs"
                            >No cover available</span
                        >
                    {/if}
                {/await}
            {/if}
        </div>

        <div class="w-[52rem] px-4 py-2">
            <p class="font-serif text-2xl capitalize">{item.title}</p>
            <hr class="my-2" />
            <p>This book</p>
        </div>
    </div>
</dialog>

{#if viewMode === "grid"}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div
        on:click={openDialog}
        class="
        bg-white border border-gray-700
        h-fit relative
        hover:-translate-y-1 z-40
        {loading ? '' : 'cursor-pointer'}
        "
        title={loading ? "Loading..." : item.title}
    >
        <div
            class="absolute bg-gray-500/50 translate-x-1 translate-y-1 -z-10 top-0 left-0 h-full w-full"
        ></div>
        <div
            class="z-10 bg-gray-100 flex items-center justify-center aspect-square relative overflow-hidden"
        >
            {#if loading}
                <div class="w-full h-full bg-gray-200 animate-pulse"></div>
            {:else}
                {#await coverUrlPromise}
                    <div class="w-full h-full bg-gray-200 animate-pulse"></div>
                {:then coverUrl}
                    {#if coverUrl}
                        <img
                            src={coverUrl}
                            alt={item.title}
                            class=""
                            on:error={handleImageError}
                        />
                        <span class="text-gray-400 text-xs hidden"
                            >No cover available</span
                        >
                    {:else}
                        <span class="text-gray-400 text-xs"
                            >No cover available</span
                        >
                    {/if}
                {/await}
            {/if}
        </div>
        <div class="px-3 py-2 bg-white z-10 flex space-between flex-col">
            {#if loading}
                <div
                    class="h-4 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"
                ></div>
                <div
                    class="h-3 bg-gray-200 rounded w-1/2 mb-2 animate-pulse"
                ></div>
                <div class="h-3 bg-gray-200 rounded w-1/4 animate-pulse"></div>
            {:else}
                <h2
                    class="text-sm font-serif leading-tight line-clamp-2 capitalize"
                    title={item.title}
                >
                    {item.title}
                </h2>
                <p class="text-xs text-gray-600 pt-1 text-right clamp-1">
                    {getAuthors(item)}
                </p>
                <p class="text-xs text-gray-600 text-right">
                    {"Added: " +
                        new Date(item.dateAdded).toLocaleString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}
                </p>
            {/if}
        </div>
    </div>
{:else}
    <div
        class="bg-white border border-gray-700 p-4 mb-4 flex items-center hover:bg-gray-50 cursor-pointer"
        title={loading ? "Loading..." : item.title}
    >
        <div class="flex-shrink-0 w-16 h-16 mr-4">
            {#if loading}
                <div class="w-full h-full bg-gray-200 animate-pulse"></div>
            {:else}
                {#await coverUrlPromise}
                    <div class="w-full h-full bg-gray-200 animate-pulse"></div>
                {:then coverUrl}
                    {#if coverUrl}
                        <img
                            src={coverUrl}
                            alt={item.title}
                            class="w-full h-full object-cover"
                            on:error={handleImageError}
                        />
                        <span class="text-gray-400 text-xs hidden"
                            >No cover available</span
                        >
                    {:else}
                        <div
                            class="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 text-xs"
                        >
                            No cover
                        </div>
                    {/if}
                {/await}
            {/if}
        </div>
        <div class="flex-grow">
            {#if loading}
                <div
                    class="h-4 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"
                ></div>
                <div
                    class="h-3 bg-gray-200 rounded w-1/2 mb-2 animate-pulse"
                ></div>
                <div class="h-3 bg-gray-200 rounded w-1/4 animate-pulse"></div>
            {:else}
                <h2
                    class="text-md font-serif leading-tight line-clamp-1 capitalize"
                    title={item.title}
                >
                    {item.title}
                </h2>
                <p class="text-xs text-gray-600 mt-1">
                    {getAuthors(item)}
                </p>
                <p class="text-xs text-gray-600">
                    {"Added: " +
                        new Date(item.dateAdded).toLocaleString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}
                </p>
            {/if}
        </div>
    </div>
{/if}
