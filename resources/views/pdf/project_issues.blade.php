<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Issue Report</title>
    <style>
        body { font-family: DejaVu Sans, sans-serif; font-size: 12px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px;}
        th, td { border: 1px solid #000; padding: 6px; text-align: left; }
    </style>
</head>
<body>
<h2>Project Report</h2>
<table>
    <thead>
    <tr>
        <th>Project Title</th>
        <th>Date Created</th>
    </tr>
    </thead>
    <tbody>
        <tr>
            <td>{{ $project->name ?? 'N/A' }}</td>

            <td>{{ $project->created_at }}</td>
        </tr>
    </tbody>
    <thead>
    <tr>
        <th>ID</th>
        <th>Title</th>
        <th>Status</th>
        <th>Due Date</th>
    </tr>
    </thead>
    <tbody>
    @foreach($project->issues as $issue)
        <tr>
            <td>{{ $issue->id }}</td>
            <td>{{ $issue->title }}</td>
            <td>{{ $issue->status }}</td>
            <td>{{ $issue->due_date }}</td>
        </tr>
    @endforeach
    </tbody>
</table>
</body>
</html>
