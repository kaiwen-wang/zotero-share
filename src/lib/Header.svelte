<script>
    import { goto } from "$app/navigation";

    const navigateToAbout = () => goto("/about");
    const navigateToHome = () => goto("/");

    function onKeyDown(event) {
        // Ignore if input or textarea is focused, or if any modifier key is pressed
        if (
            event.target.tagName === "INPUT" ||
            event.target.tagName === "TEXTAREA" ||
            event.metaKey ||
            event.ctrlKey ||
            event.altKey
        ) {
            return;
        }

        const key = event.key.toLowerCase();
        if (key === "a") {
            event.preventDefault();
            navigateToAbout();
        } else if (key === "z") {
            event.preventDefault();
            navigateToHome();
        }
    }
</script>

<header class="bg-white mb-6 border-b border-black border-t px-2">
    <div class="container mx-auto flex items-center justify-between">
        <h1 class="text-xl font-serif">
            <a href="/" class="">
                <span class="text-[rgb(182,55,58)] font-medium"
                    ><span class="underline">Z</span>otero</span
                > Reading List
            </a>
        </h1>

        <div class="py-3 flex gap-4 items-center justify-center">
            <a href="/about" class="text-lg hover:underline cursor-pointer">
                <span class="underline">A</span>bout
            </a>

            <a
                href="/tutorial"
                class="text-lg hover:underline cursor-pointer bg-blue-500 text-white rounded px-3 py-1.5"
            >
                Get started
            </a>
        </div>
    </div>
</header>

<svelte:window on:keydown={onKeyDown} />
