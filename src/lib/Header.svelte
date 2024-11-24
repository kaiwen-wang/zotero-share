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
            new Audio("blip1.mp4").play();
        } else if (key === "z") {
            event.preventDefault();
            navigateToHome();
            new Audio("blip1.mp4").play();
        } else if (key === "u") {
            event.preventDefault();
            goto("/tutorial");
            new Audio("blip1.mp4").play();
        }
    }
</script>

<header class="bg-white mb-6 border-b border-black border-t px-2">
    <div class="container mx-auto flex items-center justify-between">
        <h1 class="text-xl font-medium">
            <a href="/" class="">
                <span class="text-[rgb(182,55,58)] font-medium"
                    ><span class="underline">Z</span>otero</span
                >Together<sup>⚭</sup>
            </a>
        </h1>

        <div class="py-1.5 flex gap-[1.1rem] items-center justify-center">
            <a href="/about" class="text-sm hover:underline cursor-pointer">
                <span class="underline">A</span>bout
            </a>

            <a
                href="/tutorial"
                class="text-sm tracking-tight hover:underline cursor-pointer border-[3px] font-medium bg-blue-500 text-white border-white px-3 py-1.5"
            >
                <span class="underline">U</span>sage Instructions
            </a>
        </div>
    </div>
</header>

<svelte:window on:keydown={onKeyDown} />
