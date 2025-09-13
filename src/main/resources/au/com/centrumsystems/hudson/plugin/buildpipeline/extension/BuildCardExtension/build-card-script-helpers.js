Handlebars.registerHelper('startScript', function() {
    return new Handlebars.SafeString("<script>");
});

Handlebars.registerHelper('endScript', function() {
    return new Handlebars.SafeString("</script>");
});

/**
 * Handlebars helper to safely escape strings for use in JavaScript contexts
 * This prevents XSS vulnerabilities when user-controlled data is embedded in JavaScript
 */
Handlebars.registerHelper('jsEscape', function(str) {
    if (!str) {
        return '';
    }
    // Escape characters that could break out of JavaScript string context
    return str.toString()
        .replace(/\\/g, '\\\\')  // Escape backslashes first
        .replace(/'/g, "\\'")    // Escape single quotes
        .replace(/"/g, '\\"')    // Escape double quotes
        .replace(/\n/g, '\\n')   // Escape newlines
        .replace(/\r/g, '\\r')   // Escape carriage returns
        .replace(/\t/g, '\\t')   // Escape tabs
        .replace(/\f/g, '\\f')   // Escape form feeds
        .replace(/\b/g, '\\b')   // Escape backspaces
        .replace(/\v/g, '\\v')   // Escape vertical tabs
        .replace(/\0/g, '\\0')   // Escape null characters
        .replace(/\x08/g, '\\b') // Escape backspace
        .replace(/\x0c/g, '\\f') // Escape form feed
        .replace(/\x85/g, '\\x85') // Escape next line
        .replace(/\u2028/g, '\\u2028') // Escape line separator
        .replace(/\u2029/g, '\\u2029') // Escape paragraph separator
        .replace(/</g, '\\u003c')      // Escape < to prevent script injection
        .replace(/>/g, '\\u003e')      // Escape > to prevent script injection
        .replace(/&/g, '\\u0026');     // Escape & to prevent entity injection
});

/**
 * Safe console dialog helper that works with Jenkins URL structure
 * Uses the global jenkinsRootURL variable set by Jelly template
 */
Handlebars.registerHelper('safeConsoleDialog', function(buildUrl, projectName, buildNumber) {
    // Escape only the display parameters for XSS protection
    var safeProjectName = (projectName || '').toString()
        .replace(/\\/g, '\\\\')
        .replace(/'/g, "\\'")
        .replace(/"/g, '\\"')
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/&/g, '&amp;');
    
    var safeBuildNumber = (buildNumber || '').toString().replace(/[^0-9]/g, '');
    
    // Clean and validate the build URL
    var cleanBuildUrl = (buildUrl || '').toString().replace(/['"<>&]/g, '');
    
    // Use window.jenkinsRootURL that was set globally in bpp.jelly
    var fullUrl = (window.jenkinsRootURL || '') + '/' + cleanBuildUrl + 'console';
    
    return new Handlebars.SafeString(
        "buildPipeline.fillDialog('" + fullUrl + "', 'Console output for " + safeProjectName + " #" + safeBuildNumber + "')"
    );
});

/**
 * Safe trigger build helper that escapes parameters for XSS protection
 */
Handlebars.registerHelper('safeTriggerBuild', function(id, upstreamProject, upstreamBuild, projectName, dependencies) {
    var safeId = parseInt(id) || 0;
    var safeUpstreamProject = upstreamProject ? upstreamProject.toString().replace(/'/g, "\\'").replace(/"/g, '\\"') : '';
    var safeUpstreamBuild = parseInt(upstreamBuild) || 0;
    var safeProjectName = projectName ? projectName.toString().replace(/'/g, "\\'").replace(/"/g, '\\"') : '';
    var safeDependencies = dependencies || '[]';
    
    return new Handlebars.SafeString(
        "buildPipeline.triggerBuild(" + safeId + ", '" + safeUpstreamProject + "', " + 
        safeUpstreamBuild + ", '" + safeProjectName + "', " + safeDependencies + ")"
    );
});

/**
 * Safe rerun build helper that escapes parameters for XSS protection  
 */
Handlebars.registerHelper('safeRerunBuild', function(id, extId, dependencies) {
    var safeId = parseInt(id) || 0;
    var safeExtId = extId ? extId.toString().replace(/'/g, "\\'").replace(/"/g, '\\"') : '';
    var safeDependencies = dependencies || '[]';
    
    return new Handlebars.SafeString(
        "buildPipeline.rerunBuild(" + safeId + ", '" + safeExtId + "', " + safeDependencies + ")"
    );
});

