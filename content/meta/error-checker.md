+++
title= "Error Checker"
date= 2024-09-13T06:20:24-05:00
draft= false
tags = ["Meta"]
categories = []
contributors = ["The 64th Gamer"]
+++

## All Categories

Double check no strange categories have been created!
{{< list-all-categories.inline >}}
  <div class="tri-column">
    <ul>
      {{- range $name, $taxonomy := .Site.Taxonomies.categories -}}
        {{- $cnt := len $taxonomy -}}
        {{- with $.Site.GetPage (printf "/categories/%s" $name) -}}
          <li>
            <a href="{{- .RelPermalink -}}" title="All pages with tag <i>{{- .Title -}}</i>">{{- .Title -}}</a>
            <sup> {{- $cnt -}}</sup>
          </li>
        {{- end -}}
      {{- end -}}
    </ul>
  </div>
{{< /list-all-categories.inline >}}

------------------------------------------------------------------------

## All Tags

Double check no strange tags have been created!
{{< list-all-tags.inline >}}
  <div class="tri-column">
    <ul>
      {{- range $name, $taxonomy := .Site.Taxonomies.tags -}}
        {{- $cnt := len $taxonomy -}}
        {{- with $.Site.GetPage (printf "/tags/%s" $name) -}}
          <li>
            <a href="{{- .RelPermalink -}}" title="All pages with tag <i>{{- .Title -}}</i>">{{- .Title -}}</a>
            <sup> {{- $cnt -}}</sup>
          </li>
        {{- end -}}
      {{- end -}}
    </ul>
  </div>
{{< /list-all-tags.inline >}}


------------------------------------------------------------------------

## All Pages Without Tags

These pages need tags, otherwise nobody can find them!
{{< list-untagged-pages.inline >}}
  <div class="tri-column">
    <ul>
        {{- range site.RegularPages -}}
          {{- if not .Params.tags -}}
            <li><a href="{{- .Permalink -}}">{{- .Title -}}</a></li>
          {{- end -}}
        {{- end -}}
    </ul>
  </div>
{{< /list-untagged-pages.inline >}}


------------------------------------------------------------------------

## Unlinked Photo Pages

These photos need links to other pages, otherwise nobody can find them!
{{< list-untagged-photos.inline >}}
  <div class="tri-column">
    <ul>
      {{ range where site.RegularPages "Section" "photos" }}
        {{ if not .Params.pages }}
          <li><a href="{{ .Permalink }}">{{ .Title }}</a></li>
        {{ end }}
      {{ end }}
    </ul>
  </div>
{{< /list-untagged-photos.inline >}}

------------------------------------------------------------------------

## Uncategorized Pages

These pages need categories otherwise it's hard to filter!
{{< list-uncategorized-pages.inline >}}
  <div class="tri-column">
    <ul>
        {{- range where site.RegularPages "Section" "!=" "photos" -}}
          {{- if not .Params.categories -}}
            <li><a href="{{- .Permalink -}}">{{- .Title -}}</a></li>
          {{- end -}}
        {{- end -}}
    </ul>
  </div>
{{< /list-uncategorized-pages.inline >}}

------------------------------------------------------------------------

## Uncategorized Photo Pages

These photos need categories otherwise it's hard to filter!
{{< list-uncategorized-photos.inline >}}
  <div class="tri-column">
    <ul>
        {{- range where site.RegularPages "Section" "photos" -}}
          {{- if not .Params.categories -}}
            <li><a href="{{- .Permalink -}}">{{- .Title -}}</a></li>
          {{- end -}}
        {{- end -}}
    </ul>
  </div>
{{< /list-uncategorized-photos.inline >}}

------------------------------------------------------------------------

## Photo Pages Missing Files

Photo .html pages that link to a nonexisting photo
{{< list-photo-pages-no-photo.inline >}}
<div class="tri-column">
    <ul>
      {{/* Define the directory for photos */}}
      {{ $photosDir := "static/photos" }}
      {{ $photos := readDir $photosDir }}
  
      {{/* Collect all photo names from static/photos (without extensions) */}}
      {{ $photoNames := slice }}
      {{ range $photos }}
          {{ $photoFile := .Name }}
          {{ $photoNames = $photoNames | append $photoFile }}
      {{ end }}
  
      {{/* Iterate over all content pages in the "photos" section */}}
      {{ range site.RegularPages }}
          {{ if eq .Section "photos" }}
            {{ if and (ne .Title "Photos") (not (in $photoNames .Title)) }}
                <li><a href="{{ .Permalink }}">{{ .Title }}</a></li>
            {{ end }}
          {{ end }}
      {{ end }}
    </ul>
  </div>
{{< /list-photo-pages-no-photo.inline >}}

------------------------------------------------------------------------

## Unused Photos

Photos that have no .html file describing them or anything.
{{< list-photos-no-page.inline >}}
  <ul>
    {{/* Define the directory for photos */}}
    {{ $photosDir := "static/photos" }}
    {{ $photos := readDir $photosDir }}

    {{/* Collect all page titles from the photos section */}}
    {{ $titles := slice }}
    {{ range site.RegularPages }}
        {{ if eq .Section "photos" }}
            {{ $titles = $titles | append .Title }}
        {{ end }}
    {{ end }}

    {{/* Iterate over all photo files */}}
    {{ range $photos }}
        {{ $photoFile := .Name }}
        {{/* If the photo name is not in the list of titles, output it */}}
        {{ if not (in $titles $photoFile) }}
            <li><a href="{{ relURL "/photos/" }}{{ $photoFile }}" target="_blank">{{ $photoFile }}</a></li>
        {{ end }}
    {{ end }}
  </ul>
{{< /list-photos-no-page.inline >}}
