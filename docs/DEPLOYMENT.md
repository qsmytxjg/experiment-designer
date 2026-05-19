# Public Deployment

This app is a static Vite/React site. It can be deployed to GitHub Pages, Vercel, Netlify, or any static file host.

## GitHub Pages

1. Create a GitHub repository, for example:

   ```text
   qsmytxjg/experiment-designer
   ```

2. Add the remote repository locally:

   ```bash
   git remote add origin https://github.com/qsmytxjg/experiment-designer.git
   ```

3. Push the project:

   ```bash
   git push -u origin master
   ```

4. In GitHub, open the repository settings:

   ```text
   Settings -> Pages -> Build and deployment -> Source -> GitHub Actions
   ```

5. The included workflow `.github/workflows/deploy-pages.yml` will build the app and publish it.

The public URL will usually look like:

```text
https://qsmytxjg.github.io/experiment-designer/
```

## Custom Domain

If you own a domain, such as:

```text
plate.example.com
```

Add the domain in:

```text
Repository Settings -> Pages -> Custom domain
```

Then add the required DNS record at your domain provider.

For a subdomain, GitHub Pages usually needs a `CNAME` DNS record:

```text
plate.example.com -> qsmytxjg.github.io
```

After DNS finishes propagating, enable HTTPS in the same GitHub Pages settings page.
