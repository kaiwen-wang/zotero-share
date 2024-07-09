<script>
    export let item;
    export let loading = false; // New prop for loading state
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

    function getCoverUrl(item) {
        if (item.ISBN) {
            return `https://covers.openlibrary.org/b/isbn/${item.ISBN.split(" ")[0]}-M.jpg`;
        } else if (item.DOI) {
            return `https://covers.openlibrary.org/b/doi/${item.DOI}-M.jpg`;
        } else if (item.ISSN) {
            return `https://covers.openlibrary.org/b/issn/${item.ISSN}-M.jpg`;
        } else {
            return null;
        }
    }

    $: coverUrl = loading ? null : getCoverUrl(item);
</script>

{#if viewMode === "grid"}
    <div
        class="bg-white border border-gray-700 h-fit relative hover:-translate-y-1 cursor-pointer"
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
            {:else if coverUrl}
                <img src={coverUrl} alt={item.title} class="" />
            {:else}
                <span class="text-gray-400 text-xs">No cover available</span>
            {/if}
        </div>
        <div class="px-4 pt-3 pb-3 bg-white z-10 flex space-between flex-col">
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
                    class="text-md font-test leading-tight line-clamp-2 capitalize"
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
            {:else if coverUrl}
                <img
                    src={coverUrl}
                    alt={item.title}
                    class="w-full h-full object-cover"
                />
            {:else}
                <div
                    class="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 text-xs"
                >
                    No cover
                </div>
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
                    class="text-md font-test leading-tight line-clamp-1 capitalize"
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
