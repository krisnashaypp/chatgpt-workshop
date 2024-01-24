import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.http.HttpRequest.BodyPublishers;
import java.net.http.HttpResponse.BodyHandlers;
import java.util.HashMap;
import java.util.List;

import org.json.JSONObject;

public class Main {

    public static void main(String[] args) {
        String apiKey = "<your-api-key-here>"; // Replace with your actual OpenAI API key
        String model = "gpt-3.5-turbo"; // Or another model name
        String prompt = "Can you tell me a joke?"; // Your prompt

        HashMap<String, String> map = new HashMap<>();
        map.put("role", "user");
        map.put("content", prompt);

        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://api.openai.com/v1/chat/completions"))
                .header("Content-Type", "application/json")
                .header("Authorization", "Bearer " + apiKey)
                .POST(BodyPublishers.ofString(new JSONObject()
                        .put("messages", List.of(map))
                        .put("model", model)
                        .put("max_tokens", 100)
                        .toString()))
                .build();

        try {
            HttpResponse<String> response = client.send(request, BodyHandlers.ofString());
            JSONObject jsonResponse = new JSONObject(response.body());
            String textResponse = jsonResponse.getJSONArray("choices")
                    .getJSONObject(0)
                    .getJSONObject("message")
                    .getString("content");
            System.out.println(textResponse);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}