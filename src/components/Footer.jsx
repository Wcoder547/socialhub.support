import React from 'react'
import { FaFacebookF, FaInstagram, FaTiktok, FaYoutube } from "react-icons/fa";

const Footer = () => {
  return (
    <>  <footer className="border-t border-[#2a0f26] bg-[#120814] pt-10 pb-6 text-xs text-white/60">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 md:flex-row md:items-center md:justify-between md:px-6">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-pink-500">
            <span className="text-xs font-bold text-white">▲</span>
          </div>
          <span className="text-sm font-semibold text-white">
           socialhub.support
          </span>
        </div>

        {/* Link columns */}
        <div className="flex flex-col gap-6 text-[11px] md:flex-row md:gap-12">
          <div className="space-y-2">
            <div className="font-semibold text-white">Links</div>
            <button className="block hover:text-white">Services</button>
            <button className="block hover:text-white">Features</button>
            <button className="block hover:text-white">Pricing</button>
          </div>

          <div className="space-y-2">
            <button className="block font-semibold text-white hover:text-white">
              Privacy Policy
            </button>
            <button className="block font-semibold text-white hover:text-white">
              Terms of Service
            </button>
            <button className="block font-semibold text-white hover:text-white">
              Contact Support
            </button>
          </div>
        </div>

        {/* Social icons */}
        <div className="flex items-center gap-3">
          <a
            href="#"
            aria-label="Facebook"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1877f2] text-white"
          >
            <FaFacebookF className="h-4 w-4" />
          </a>
          <a
            href="#"
            aria-label="Instagram"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-tr from-[#f58529] via-[#dd2a7b] to-[#8134af] text-white"
          >
            <FaInstagram className="h-4 w-4" />
          </a>
          <a
            href="#"
            aria-label="TikTok"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-white"
          >
            <FaTiktok className="h-4 w-4" />
          </a>
          <a
            href="#"
            aria-label="YouTube"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#ff0000] text-white"
          >
            <FaYoutube className="h-4 w-4" />
          </a>
        </div>
      </div>

      <div className="mt-8 border-t border-[#2a0f26] pt-4 text-center text-[10px] text-white/40">
        © 2025socialhub.supportth. All rights reserved. Not affiliated with TikTok Inc.
      </div>
    </footer>
    </>
  )
}

export default Footer