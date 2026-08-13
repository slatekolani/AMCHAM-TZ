<?php

namespace App\Support;

use DOMDocument;
use DOMElement;
use DOMNode;
use DOMXPath;

final class HtmlSanitizer
{
    private const ALLOWED_TAGS = ['p', 'br', 'strong', 'b', 'em', 'i', 'u', 's', 'ul', 'ol', 'li', 'blockquote', 'h2', 'h3', 'h4', 'a'];
    private const ALLOWED_ATTRIBUTES = ['href', 'title', 'target', 'rel'];

    public static function clean(?string $html): ?string
    {
        if ($html === null || trim($html) === '') {
            return $html;
        }

        $document = new DOMDocument('1.0', 'UTF-8');
        $previous = libxml_use_internal_errors(true);
        $document->loadHTML('<?xml encoding="UTF-8"><div id="content">' . $html . '</div>', LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD);
        libxml_clear_errors();
        libxml_use_internal_errors($previous);

        $root = (new DOMXPath($document))->query('//*[@id="content"]')->item(0);
        if (! $root) {
            return '';
        }

        self::sanitizeChildren($root);

        $result = '';
        foreach ($root->childNodes as $child) {
            $result .= $document->saveHTML($child);
        }

        return $result;
    }

    private static function sanitizeChildren(DOMNode $parent): void
    {
        foreach (iterator_to_array($parent->childNodes) as $node) {
            if ($node instanceof DOMElement) {
                $tag = strtolower($node->tagName);

                if (! in_array($tag, self::ALLOWED_TAGS, true)) {
                    if (in_array($tag, ['script', 'style', 'iframe', 'object', 'embed', 'svg', 'math'], true)) {
                        $parent->removeChild($node);
                        continue;
                    }

                    self::sanitizeChildren($node);
                    while ($node->firstChild) {
                        $parent->insertBefore($node->firstChild, $node);
                    }
                    $parent->removeChild($node);
                    continue;
                }

                foreach (iterator_to_array($node->attributes) as $attribute) {
                    if (! in_array(strtolower($attribute->name), self::ALLOWED_ATTRIBUTES, true)) {
                        $node->removeAttribute($attribute->name);
                    }
                }

                if ($tag === 'a') {
                    $href = trim($node->getAttribute('href'));
                    if ($href !== '' && ! preg_match('/^(https?:|mailto:|tel:|\/|#)/i', $href)) {
                        $node->removeAttribute('href');
                    }
                    if ($node->getAttribute('target') === '_blank') {
                        $node->setAttribute('rel', 'noopener noreferrer');
                    } else {
                        $node->removeAttribute('target');
                        $node->removeAttribute('rel');
                    }
                }

                self::sanitizeChildren($node);
            }
        }
    }
}
