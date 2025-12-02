"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, LucideIcon } from "@/icons/Icons";

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: string[] | { name: string; icon?: LucideIcon; value?: string }[];
  placeholder: string;
  label: string;
  required?: boolean;
  icon?: React.ReactNode;
  error?: string;
  touched?: boolean;
  disabled?: boolean;
  searchable?: boolean;
}

export function CustomSelect({
  value,
  onChange,
  options,
  placeholder,
  label,
  required = false,
  icon,
  error,
  touched,
  disabled = false,
  searchable = false,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchQuery("");
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
        setSearchQuery("");
      }
    }

    // Use a small delay to avoid immediate closing
    const timeoutId = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }, 0);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen, searchable]);

  const hasError = touched && error;

  const normalizedOptions = useMemo(() => {
    return (options as Array<
      string | { name: string; icon?: LucideIcon; value?: string }
    >).map((option) => {
      if (typeof option === "string") {
        return {
          name: option,
          value: option,
          IconComponent: null as LucideIcon | null,
        };
      }

      return {
        name: option.name,
        value: option.value ?? option.name,
        IconComponent: option.icon ?? null,
      };
    });
  }, [options]);

  const filteredOptions = useMemo(() => {
    let options = normalizedOptions;
    
    if (searchable && searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      options = normalizedOptions.filter((option) =>
        option.name.toLowerCase().includes(query)
      );
    }
    
    return options.slice(0, 500);
  }, [normalizedOptions, searchQuery, searchable]);

  const selectedOption = normalizedOptions.find((option) => option.value === value);
  const displayValue = selectedOption ? selectedOption.name : value;
  
  return (
    <div>
      <label className={`block text-xs font-medium mb-1.5 ${hasError ? 'text-red-500' : 'text-muted-foreground'}`}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative" ref={dropdownRef}>
        <Button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (!disabled) {
              setIsOpen(!isOpen);
            }
          }}
          onMouseDown={(e) => {
            if (!disabled) {
              e.preventDefault();
            }
          }}
          variant="ghost"
          disabled={disabled}
          className={`w-full px-0 py-2.5 bg-transparent border-0 border-b text-sm text-left 
          focus:outline-none transition-colors flex items-center justify-between gap-2 ${
            disabled 
              ? 'cursor-not-allowed opacity-50' 
              : 'cursor-pointer'
          } ${
            hasError 
              ? 'border-red-500 focus:border-red-500' 
              : 'border-border focus:border-foreground'
          }`}
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {icon && (
              <span className="text-muted-foreground shrink-0">{icon}</span>
            )}
            <span
              className={value ? "text-foreground" : "text-muted-foreground"}
            >
              {value ? displayValue : placeholder}
            </span>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-muted-foreground transition-transform shrink-0 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </Button>

        {isOpen && (
          <div 
            className="absolute top-full left-0 right-0 mt-1 bg-popover rounded-xl shadow-lg border border-border py-2 z-[100] max-h-60 overflow-hidden flex flex-col"
            onMouseDown={(e) => e.preventDefault()}
          >
            {searchable && (
              <div className="px-3 pb-2 border-b border-border">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    e.stopPropagation();
                    setSearchQuery(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    e.stopPropagation();
                    if (e.key === "Enter" && filteredOptions.length > 0) {
                      onChange(filteredOptions[0].value);
                      setIsOpen(false);
                      setSearchQuery("");
                    }
                  }}
                  placeholder={`Search ${label.toLowerCase()}...`}
                  className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-foreground/20 text-foreground placeholder:text-muted-foreground"
                  onClick={(e) => e.stopPropagation()}
                  onMouseDown={(e) => e.stopPropagation()}
                />
              </div>
            )}
            <div className="overflow-y-auto max-h-[200px] overscroll-contain">
              {filteredOptions.length === 0 ? (
                <div className="px-4 py-3 text-sm text-muted-foreground text-center">
                  {searchable && searchQuery ? "No options found" : "No options available"}
                </div>
              ) : (
                <>
                  {!searchable && normalizedOptions.length > 500 && (
                    <div className="px-4 py-2 text-xs font-medium text-muted-foreground sticky top-0 bg-popover border-b border-border">
                      Showing first 500 options. Use search to find more.
                    </div>
                  )}
                  {!searchable && normalizedOptions.length <= 500 && (
                    <div className="px-4 py-2 text-xs font-medium text-muted-foreground sticky top-0 bg-popover">
                      {placeholder}
                    </div>
                  )}
                  {filteredOptions.map((option) => {
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onChange(option.value);
                          setIsOpen(false);
                          setSearchQuery("");
                        }}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        className="w-full px-4 py-2.5 text-left text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer flex items-center gap-2"
                      >
                        {option.IconComponent && <option.IconComponent className="w-4 h-4 shrink-0" />}
                        <span className="truncate">{option.name}</span>
                      </button>
                    );
                  })}
                </>
              )}
            </div>
          </div>
        )}
      </div>
      {hasError && (
        <p className="text-xs text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
}
